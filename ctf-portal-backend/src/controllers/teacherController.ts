import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";
import TeacherLogic from "../logic/teacherLogic";
import { validate } from "../utils/validation/validateBody";
import Login from "../models/viewmodels/Login";
import authMiddleware from "../utils/authMiddleware";

class TeacherController implements Controller {
	path: string = "/teacher";
	router: Router = Router();

	private teacherLogic: TeacherLogic = new TeacherLogic();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post("/login", validate(Login), this.login);
		this.router.post("/logout", this.logout);
		this.router.get("/start", authMiddleware(), this.startWorkshop);
	}

	private login = async (req: Request, res: Response, next: NextFunction) => {
		const userData: Login = req.body;
		try {
			const { cookie, user } = await this.teacherLogic.login(userData);
			res.setHeader("Set-Cookie", [cookie]);
			res.send(user);
		} catch (error) {
			next(error);
		}
	};

	private logout = (req: Request, res: Response) => {
		res.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
		res.send(200);
	};

	private startWorkshop = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		await this.teacherLogic.startGame();
		return res.send(200);
	};
}

export default TeacherController;
