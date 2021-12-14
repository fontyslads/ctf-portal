import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";
import TeacherLogic from "../logic/teacherLogic";

class TeacherController implements Controller {
	path: string = "/teacher";
	router: Router = Router();

	private teacherLogic: TeacherLogic = new TeacherLogic();

	keycloak = require("../config/keycloak-config.js").getKeycloak();
	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(
			"/start",
			this.keycloak.protect("teacher"),
			this.startWorkshop
		);
	}

	private startWorkshop = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const started = await this.teacherLogic.startGame();
		return res.status(200).send({ started });
	};
}

export default TeacherController;
