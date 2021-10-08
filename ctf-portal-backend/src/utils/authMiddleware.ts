// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken"

// //exceptions
// import { BadRequestException, UnauthorizedException } from "@kwetter/models";

// const AUTH_URL =
// 	(process.env.AUTH_SERVICE_HOST
// 		? process.env.AUTH_SERVICE_HOST
// 		: "http://localhost:3001") + "/auth/validate";

// export async function authenticate(
// 	req: Request,
// 	res: Response,
// 	next: NextFunction
// ) {
// 	if (req.path.startsWith("/auth")) return next();

// 	if (!req.headers["authorization"])
// 		return next(new BadRequestException("No authorization headers present..."));

//         const decoded = jwt.verify(token, this.jwtSecret);

// 	if (!status) return next(new UnauthorizedException("Invalid token..."));

// 	delete decoded.iat;
// 	delete decoded.exp;
// 	req.headers["decoded"] = decoded;
// 	return next();
// }
