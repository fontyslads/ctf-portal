import { Repository, getConnection } from "typeorm";
import bcrypt from "bcrypt";

import SignUp from "../models/viewmodels/auth/SignUp";
import Auth from "../models/entities/Auth";
import SignIn from "../models/viewmodels/auth/SignIn";

import jwt from "jsonwebtoken";
import BadRequestException from "../utils/exceptions/httpExceptions/badRequestException";

class AuthLogic {
	private repository: Repository<Auth>;
	private jwtSecret: string = process.env.JWT_SECRET as string;

	constructor() {
		this.repository = getConnection(process.env.ORM_CONFIG).getRepository(Auth);
	}

	public async signUp(signUp: SignUp): Promise<Auth> {
		const saltRounds = 10;
		signUp.password = await bcrypt.hash(signUp.password, saltRounds);

		const auth = await this.repository.save(signUp);
		auth.password = "";
		return auth;
	}

	public async signIn(signIn: SignIn): Promise<Auth> {
		const user = await this.repository.findOne({
			where: { username: signIn.username }
		});
		if (!user) throw new BadRequestException("Invalid username or password...");
		if (!bcrypt.compareSync(signIn.password, user.password))
			throw new BadRequestException("Invalid username or password...");

		const token = jwt.sign(
			{ username: signIn.username, team: signIn.team },
			this.jwtSecret
		);
		user.password = token;
		return user;
	}
}

export default AuthLogic;
