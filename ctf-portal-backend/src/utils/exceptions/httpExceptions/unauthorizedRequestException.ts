import HttpException from "../httpException";

class UnauthorizedRequestException extends HttpException {
	constructor(message: string) {
		super(401, message);
	}
}

export default UnauthorizedRequestException;
