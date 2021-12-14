import { NextFunction, RequestHandler, Response, Request } from "express";
import jwt from "jsonwebtoken";
import TeacherLogic from "../logic/teacherLogic";
import User from "../models/entities/User";
import UnauthorizedRequestException from "./exceptions/httpExceptions/unauthorizedRequestException";

function authMiddleware(): RequestHandler {
	const teacherLogic = new TeacherLogic();

	return async (req: Request, res: Response, next: NextFunction) => {
		const cookies = req.cookies;
		if (!cookies || !cookies.Authorization)
			next(new UnauthorizedRequestException("Authentication token missing..."));

		const secret = process.env.JWT_SECRET as string;

		try {
			const verificationResponse = jwt.verify(
				cookies.Authorization,
				secret
			) as User;

			const user = await teacherLogic.getByIdAndUsername(verificationResponse);
			if (!user)
				throw new UnauthorizedRequestException(
					"Invalid authentication token..."
				);

			next();
		} catch (error) {
			next(new UnauthorizedRequestException("Invalid authentication token..."));
		}
	};
}

export default authMiddleware;
