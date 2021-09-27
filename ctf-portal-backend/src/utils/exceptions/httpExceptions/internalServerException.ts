import HttpException from "../httpException";

class InternalServerException extends HttpException {
	constructor(err: Error) {
		super(500, "Whoops! Something went wrong...");
	}
}

export default InternalServerException;
