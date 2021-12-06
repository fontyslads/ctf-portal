import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";

import FlagLogic from "../logic/flagLogic";
import { validate } from "../utils/validation/validateBody";
import SubmitFlag from "../models/viewmodels/SubmitFlag";
import { isEnum } from "class-validator";
import Team from "../models/enums/Team";
import BadRequestException from "../utils/exceptions/httpExceptions/badRequestException";
import Flag from "../models/entities/Flag";

class FlagController implements Controller {
	path: string = "/flag";
	router: Router = Router();

	private flagLogic: FlagLogic = new FlagLogic();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get("/:team", this.listFlags);
		this.router.post("/submit", validate(SubmitFlag), this.submitFlag);
	}

	private listFlags = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const team = req.params.team;
		if (!isEnum(team, Team))
			return next(new BadRequestException("team is invalid"));

		const flags = await this.flagLogic.listFlags(team as unknown as Team);
		return res.status(200).send(flags);
	};

	private submitFlag = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const flagSubmit: SubmitFlag = req.body;
		await this.flagLogic
			.submitFlag(flagSubmit.id, flagSubmit.hash)
			.then((flags: Flag[]) => {
				return res.status(200).send(flags);
			})
			.catch((err) => next(err));
	};
}

export default FlagController;
