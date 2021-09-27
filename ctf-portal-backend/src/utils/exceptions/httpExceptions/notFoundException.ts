import HttpException from "../httpException";

class NotFoundException extends HttpException {
  constructor(object: string, query?: string, value?: string) {
    if (!query || !value) {
      super(404, `No ${object.toLowerCase()} found...`);
    } else {
      super(
        404,
        `${object} with ${query.toLowerCase()} '${value}' not found...`
      );
    }
  }
}

export default NotFoundException;
