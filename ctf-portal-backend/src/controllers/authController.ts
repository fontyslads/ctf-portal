import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";

import AuthLogic from "../logic/authLogic";
import { validate } from "../utils/validation/validateBody";
import SignUp from "../models/viewmodels/auth/SignUp";
import SignIn from "../models/viewmodels/auth/SignIn";

class AuthController implements Controller {
	path: string = "/auth";
	router: Router = Router();

	private authLogic: AuthLogic = new AuthLogic();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post("/signup", validate(SignUp), this.signUp);
		this.router.post("/signin", validate(SignIn), this.signIn);
	}

	private signUp = async (req: Request, res: Response, next: NextFunction) => {
		const signUp: SignUp = req.body;
		const auth = await this.authLogic.signUp(signUp);
		return res.status(200).send(auth);
	};

	private signIn = async (req: Request, res: Response, next: NextFunction) => {
		const signIn: SignIn = req.body;
		const auth = await this.authLogic.signIn(signIn);
		return res.status(200).send(auth);
	};
}

export default AuthController;
