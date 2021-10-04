import express, { Request, Response, NextFunction } from "express";
import { ValidationError, validateSync } from "class-validator";
import { toClass } from "class-converter";

type Constructor<T> = { new (): T };

export function validate<T extends object>(
	type: Constructor<T>
): express.RequestHandler {
	return (req, res, next) => {
		const input = toClass(req.body, type);

		let errors = validateSync(input);
		if (errors.length > 0) {
			next(errors);
		} else {
			req.body = input;
			next();
		}
	};
}

export function validationError(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof Array && err[0] instanceof ValidationError) {
		res.status(400).json({ errors: err }).end();
	} else {
		next(err);
	}
}
