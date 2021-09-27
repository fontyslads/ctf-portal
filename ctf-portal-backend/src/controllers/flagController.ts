import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";

class FlagController implements Controller {
	path: string = "/flag";
	router: Router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get("/", this.test);
	}

	private test = async (req: Request, res: Response, next: NextFunction) => {
		return res.status(200).send("success");
	};
}

export default FlagController;
