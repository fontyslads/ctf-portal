import { Request, Response, NextFunction, Router } from "express";
import Controller from "./controller";

import FlagLogic from "../logic/flagLogic";
import { validate } from "../utils/validation/validateBody";
import SubmitFlag from "../models/viewmodels/SubmitFlag";
import { isEnum } from "class-validator";
import Team from "../models/enums/Team";
import BadRequestException from "../utils/exceptions/httpExceptions/badRequestException";
import Flag from "../models/entities/Flag";
import Check_reCAPTCHA_Variation from "../models/viewmodels/Check_reCAPTCHA_Variation";

class FlagController implements Controller {
	path: string = "/flag";
	router: Router = Router();
	private axios = require('axios');

	private flagLogic: FlagLogic = new FlagLogic();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		// this.router.get("/test", validate(Check_reCAPTCHA_Variation),this.test);
		this.router.get("/", this.listFlags);
		this.router.post("/submit", validate(SubmitFlag), this.submitFlag);

	}

	private listFlags = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const team = Team.Blue;
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
		if(this.checkToken(req.body.token, req.body.secretKey)){
			const flagSubmit: SubmitFlag = req.body;
			await this.flagLogic
				.submitFlag(flagSubmit.id, flagSubmit.hash)
				.then((flag: Flag) => {
					return res.status(200).send(flag);
				})
				.catch((err) => next(err));
		}


	};


	private checkToken = async (
		token : string,
		SITE_KEY : string
	) => {
		const YOUR_PRIVATE_KEY = '6LdeqJkcAAAAAGof_HmbQPjVZdkzWyGNWo0w64Vm';
		const captchaToken = `03AGdBq26ZCMZUic4Rb3EA75H4Gsfd5ywOAjVVgtfs9TRe367Qi005MsPRZre-Gm5Ppa_XwdpXpsIyLkkqXjY0222vpFiw39Zmpp7scDysKYfahOxX0s8rmGnZuniIsoIxwds59YGyOxgyFY-K0jJJKC4wnbt0ncaVs03KylJ_-ksIg0SUsY8T8PC5LSXrt9hGgolie1AoYCsH54uqhiDnzSYg8R4an5Vr7fqLV8CFSTq3uh_0PWW23e3GiKYEW-Dfw38Rfr1KmnJafHYLjLEYPbnzyBhYgB2Rh7fkGGfjUHgn9Fy7XkZO2vN1TGA095UDHpuPKl8o5NwKewGNsAZ_--rmYACVRL_DOxP7CBcosTHJLUAW120ojZf8zwzwwnuhj3NIn7s_YUuxXRqAHTRZI2fUfrHqTmSad1fmHsWoirowrqy3bnEQ_w27Z60wOVLmUlHSV3KywmejOKkS9-32Be0sqILAWQPi5Q`;
		let resu = await this.axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${SITE_KEY}&response=${token}`).then(
			(rest:  any) => {
				    let data = rest.data.success
				 	console.log(data)
				return data;
			}
		).catch( (err: any) => {
			throw err;
		}
	);

         // Dat werkt wel
		// let res = await this.axios.post('https://www.google.com/recaptcha/api/siteverify?secret=${YOUR_PRIVATE_KEY}&response=${captchaToken}');
		// let data = resu.data;
		// console.log(data);
		// res.send(data);
	}
}

export default FlagController;
