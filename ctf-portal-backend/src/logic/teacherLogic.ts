import dayjs from "dayjs";
import { Repository, getConnection } from "typeorm";
import Flag from "../models/entities/Flag";
import FlagStatus from "../models/enums/FlagStatus";

class TeacherLogic {
	private repository: Repository<Flag>;

	constructor() {
		this.repository = getConnection(process.env.ORM_CONFIG).getRepository(Flag);
	}

	public async startGame() {
		let now = dayjs();
		let timeLimit = 0;
		let flags = await this.repository.find({ order: { flagNumber: "ASC" } });

		flags.forEach((flag, index) => {
			if (index > 0) timeLimit += flag.timeLimit;
			const startTime = now.second(now.second() + timeLimit);
			flag.startTime = new Date(startTime.toISOString());
			flag.status = FlagStatus.NotSubmitted;
			flag.attempts = 0;
			flag.timeTaken = Math.ceil(flag.timeLimit * 1.5);
		});

		await this.repository.save(flags);
		return true;
	}
}

export default TeacherLogic;
