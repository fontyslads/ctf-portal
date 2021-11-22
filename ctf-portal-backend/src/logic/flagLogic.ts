import { Repository, getConnection } from "typeorm";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

import Flag from "../models/entities/Flag";
import Team from "../models/enums/Team";
import BadRequestException from "../utils/exceptions/httpExceptions/badRequestException";
import FlagStatus from "../models/enums/FlagStatus";

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
	): Promise<Flag> {
		let isValid = false;

		const flag: Flag = (await this.repository.findOne({
			where: { id }
		})) as Flag;

		if (!flag) throw new BadRequestException("Invalid id");
		if (flag.team !== team)
			throw new BadRequestException("This flag does not belong to your team");
		if (flag.status === FlagStatus.Valid)
			throw new BadRequestException("Flag is already submitted");

		const startTime = dayjs(flag.startTime);
		const endTime = startTime.second(startTime.second() + flag.timeLimit);
		if (dayjs().isAfter(endTime))
			throw new BadRequestException("Time limit exceeded");

		if (bcrypt.compareSync(hash, flag.hash as string)) {
			isValid = true;
			flag.status = FlagStatus.Valid;
			await this.repository.save(flag);

			//set startTime on next flag
			const flagNumber = flag.flagNumber;
			const newFlag = await this.repository.findOne({
				where: { flagNumber: flagNumber + 1 }
			});
			if (newFlag && newFlag.team === team) {
				newFlag.startTime = new Date(new Date().getTime() + 0 * 60 * 60 * 1000);
				newFlag.status = FlagStatus.NotSubmitted;
				newFlag.attempts = 0;
				await this.repository.save(newFlag);
			}
		} else {
			flag.status = FlagStatus.Invalid;
			flag.attempts += 1;
			await this.repository.save(flag);
		}

		delete flag.hash;
		if (!isValid) {
			delete flag.story;
		}
		return flag;
	}
}

export default FlagLogic;
