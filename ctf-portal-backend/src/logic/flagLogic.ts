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
		let flags: Flag[] = await this.repository.find({ where: { team } });

		for (let i = 0; i < flags.length; i++) {
			const flag = flags[i];
			if (flag.startTime) {
				const start = dayjs(flag.startTime);
				const end = start.second(start.second() + flag.timeLimit);
				if (
					dayjs().isAfter(end) &&
					flag.status !== FlagStatus.Valid &&
					flag.status !== FlagStatus.TimedOut
				) {
					flag.status = FlagStatus.TimedOut;
					flags = await this.updateNextFlags(flags, flag);
				}
			}
		}

		return flags.map((flag) => {
			delete flag.hash;
			if (
				flag.status !== FlagStatus.Valid &&
				flag.status !== FlagStatus.TimedOut
			)
				delete flag.story;
			return flag;
		});
	}

	public async submitFlag(
		id: number,
		hash: string,
		team: Team = Team.Blue
	): Promise<Flag[]> {
		let isValid = false;

		let flags = await this.repository.find({ where: { team } });

		const flag = flags.find((f) => f.id === id);
		if (!flag)
			throw new BadRequestException(`Flag with id ${id} does not exits`);

		const previousFlag = flags.find(
			(f) => f.flagNumber === flag.flagNumber - 1
		);
		if (
			previousFlag &&
			previousFlag.status !== FlagStatus.Valid &&
			previousFlag.status !== FlagStatus.TimedOut
		)
			throw new BadRequestException("Submit the previous flag first");
		if (!flag) throw new BadRequestException("Invalid id");
		if (flag.team !== team)
			throw new BadRequestException("This flag does not belong to your team");
		if (flag.status === FlagStatus.Valid)
			throw new BadRequestException("Flag is already submitted");

		const now = dayjs();
		const startTime = dayjs(flag.startTime);
		const timeTaken = now.diff(startTime, "second");
		const endTime = startTime.second(startTime.second() + flag.timeLimit);
		if (dayjs().isAfter(endTime))
			throw new BadRequestException("Time limit exceeded");

		if (bcrypt.compareSync(hash, flag.hash as string)) {
			isValid = true;
			flag.status = FlagStatus.Valid;
			flag.timeTaken = timeTaken;
			flags = await this.updateNextFlags(flags, flag);
		} else {
			flag.status = FlagStatus.Invalid;
			flag.attempts += 1;
			await this.repository.save(flag);
		}

		flags = await this.repository.find({ where: { team } });

		return flags.map((flag) => {
			delete flag.hash;
			if (
				flag.status !== FlagStatus.Valid &&
				flag.status !== FlagStatus.TimedOut
			)
				delete flag.story;
			return flag;
		});
	}

	private async updateNextFlags(flags: Flag[], flag: Flag): Promise<Flag[]> {
		const nextFlag = flags.find((f) => f.flagNumber === flag.flagNumber + 1);
		if (nextFlag) {
			console.log(flag.flagNumber, nextFlag.flagNumber);
			const now = dayjs();
			let timeLimit = 0;
			flags = flags.map((f) => {
				if (f.flagNumber > flag.flagNumber) {
					if (f.flagNumber > flag.flagNumber + 1) timeLimit += f.timeLimit;
					const startTime = now.second(now.second() + timeLimit);
					f.startTime = new Date(startTime.toISOString());
					f.status = FlagStatus.NotSubmitted;
					f.attempts = 0;
					f.timeTaken = Math.ceil(f.timeLimit * 1.5);
				}
				return f;
			});
		}
		return await this.repository.save(flags);
	}
}

export default FlagLogic;
