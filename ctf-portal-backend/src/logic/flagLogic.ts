import { Repository, getConnection } from "typeorm";
import bcrypt from "bcrypt";

import Flag from "../models/entities/Flag";
import Team from "../models/enums/Team";
import BadRequestException from "../utils/exceptions/httpExceptions/badRequestException";
import FlagStatus from "../models/enums/FlagStatus";

class FlagLogic {
	private repository: Repository<Flag>;
	// private axios = require('axios');

	constructor() {
		this.repository = getConnection(process.env.ORM_CONFIG).getRepository(Flag);
		// this.test();
	}

	public async listFlags(team: Team = Team.Blue): Promise<Flag[]> {
		const flags: Flag[] = await this.repository.find({ where: { team } });

		return flags.map((flag) => {
			delete flag.hash;
			delete flag.story;
			return flag;
		});
	}

	public async submitFlag(
		id: number,
		hash: string,
		team: Team = Team.Blue
	): Promise<Flag> {
		let validFlag = null;

		const flag: Flag = (await this.repository.findOne({
			where: { id }
		})) as Flag;

		if (!flag) throw new BadRequestException("Invalid id");
		if (flag.status === FlagStatus.Valid)
			throw new BadRequestException("Flag is already submitted");

		if (bcrypt.compareSync(hash, flag.hash as string)) {
			validFlag = flag;
			flag.status = FlagStatus.Valid;
			await this.repository.save(flag);
		} else {
			flag.status = FlagStatus.Invalid;
			flag.attempts += 1;
			await this.repository.save(flag);
		}

		return validFlag || flag;
	}

	// public  test(): void{
	// 	const YOUR_PRIVATE_KEY = `6LdeqJkcAAAAAGof_HmbQPjVZdkzWyGNWo0w64Vm`;
	// 	const captchaToken = `03AGdBq26LYardnXLgueJHziSVMqL7vgoZZuoJOPPXRQuUljA8…VlyeeJ7NE6kVeJRZKrsDNUn_gIST6IqYVN_n8Hv8kZ64PH6ht`;
	// 	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${YOUR_PRIVATE_KEY}&response=${captchaToken}`;
	// 	this.axios.post(url).then(( (resp:any) => {
	// 		console.log(resp);
	// 	} ));
	// 	//res.status(200).send(google_resposice.data)).catch((error) => res.status(400).send(error)
	// }
}

export default FlagLogic;
