import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";

class TeacherController implements Controller {
	path: string = "/teacher";
	router: Router = Router();
	keycloak = require("../config/keycloak-config.js").getKeycloak();
	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(
			"/start",
			this.keycloak.protect("realm:teacher"),
			this.startWorkshop
		);
	}

	private startWorkshop = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		return res.status(200).send("Dit is een test endpoint voor de docent.");
	};
}

export default TeacherController;
