import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";

class TeacherController implements Controller {
	path: string = "/teacher";
	router: Router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get("/start", this.startWorkshop);
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
