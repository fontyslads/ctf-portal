import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";

import FlagLogic from "../logic/flagLogic";
import BadRequestException from "../utils/exceptions/httpExceptions/badRequestException";
import SubmitFlag from "../models/viewmodels/SubmitFlag";

import { validate } from "../utils/validation/validateBody";

class FlagController implements Controller {
	path: string = "/flag";
	router: Router = Router();

	private flagLogic: FlagLogic = new FlagLogic();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post("/submit", validate(SubmitFlag), this.submitFlag);
	}

	private submitFlag = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const flagSubmit: SubmitFlag = req.body;
		const flagValid = await this.flagLogic.submitFlag(flagSubmit.hash);
		return res.status(200).send(flagValid);
	};
}

export default FlagController;
