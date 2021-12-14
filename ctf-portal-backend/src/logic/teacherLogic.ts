import dayjs from "dayjs";
import { Repository, getConnection } from "typeorm";
import Flag from "../models/entities/Flag";
import User from "../models/entities/User";
import FlagStatus from "../models/enums/FlagStatus";
import Login from "../models/viewmodels/Login";
import BadRequestException from "../utils/exceptions/httpExceptions/badRequestException";
import bcrypt from "bcrypt";
import TokenData from "../models/interfaces/TokenData";
import jwt from "jsonwebtoken";

class TeacherLogic {
	private repository: Repository<Flag>;
	private userRepository: Repository<User>;

	constructor() {
		this.repository = getConnection().getRepository(Flag);
		this.userRepository = getConnection().getRepository(User);
	}

	public async login({ username, password }: Login) {
		const user = await this.userRepository.findOne({ username });
		if (!user) throw new BadRequestException("Invalid credentials");

		const isPasswordMatching = await bcrypt.compare(password, user.password);
		if (!isPasswordMatching)
			throw new BadRequestException("Invalid credentials");

		user.password = "";
		const tokenData = this.createToken(user);
		const cookie = this.createCookie(tokenData);
		return {
			cookie,
			user
		};
	}

	public async getByIdAndUsername({ id, username }: User) {
		return await this.userRepository.find({ id, username });
	}

	public async register() {
		await this.userRepository.clear();

		const username = "teacher";
		const password = process.env.TEACHER_PASSWORD as string;
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await this.userRepository.save({
			username,
			password: hashedPassword
		});
		if (!user) throw new Error("Failed to create teacher account...");
		user.password = "";
		return user;
	}

	private createCookie(tokenData: TokenData) {
		return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
	}

	private createToken({ id, username }: User) {
		const expiresIn = 60 * 60; // an hour
		const secret = process.env.JWT_SECRET as string;
		return {
			token: jwt.sign({ id, username }, secret, { expiresIn }),
			expiresIn
		};
	}

	public async startGame() {
		const now = dayjs();
		let timeLimit = 0;
		const flags = await this.repository.find({ order: { flagNumber: "ASC" } });

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
