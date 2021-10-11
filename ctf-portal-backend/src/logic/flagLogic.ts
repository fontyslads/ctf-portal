import { Repository, getConnection } from "typeorm";
import bcrypt from "bcrypt";

import Flag from "../models/entities/Flag";
import Team from "../models/enums/Team";
import BadRequestException from "../utils/exceptions/httpExceptions/badRequestException";

class FlagLogic {
	private repository: Repository<Flag>;

	constructor() {
		this.repository = getConnection(process.env.ORM_CONFIG).getRepository(Flag);
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
	): Promise<boolean> {
		let validFlag = null;

		const flag: Flag = (await this.repository.findOne({
			where: { id }
		})) as Flag;

		if (!flag) throw new BadRequestException("Invalid id");
		if (flag.submitted)
			throw new BadRequestException("Flag is already submitted");

		if (bcrypt.compareSync(hash, flag.hash as string)) {
			validFlag = flag;
			flag.submitted = true;
			await this.repository.save(flag);
		}

		if (validFlag) return true;
		return false;
	}
}

export default FlagLogic;
