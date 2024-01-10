import { Request, Response } from 'express';

class CustomError extends Error {
  override name: string = 'Custom error name';
  number: number = 0;
  clientMessage: string = this.message;
  constructor(error: string | Error) {
    super(typeof error === 'string' ? error : error.message);
  }
}

class BadRequest extends CustomError {
  override name: string = 'Bad request';
  override number: number = 400;
  constructor(message: string) {
    super(message);
  }
}
class NotFound extends CustomError {
  override name: string = 'Not found';
  override number: number = 404;
  constructor(message: string) {
    super(message);
  }
}
class InternalServerError extends CustomError {
  override name: string = 'Internal Server Error';
  override number: number = 500;
  override clientMessage: string =
    'Unable to resolve request. Please try again later.';
  constructor(error: Error) {
    super(error);
  }
}
class BadGateway extends CustomError {
  override name: string = 'Bad gateway';
  override number: number = 502;
  override clientMessage: string =
    'Unable to load data. Please try again later.';
  constructor(message: string) {
    super(message);
  }
}

interface Errors {
  [key: string]: typeof CustomError;
}
export const errors: Errors = {};
errors[BadRequest.name] = BadRequest;
errors[NotFound.name] = NotFound;
errors[InternalServerError.name] = InternalServerError;
errors[BadGateway.name] = BadGateway;
// call: next(new errors.BadRequest('Missing request parameter(s)'));

export const errorHandler = (
  err: CustomError,
  _: Request,
  res: Response,
  __: Function
): void => {
  console.error(err.number, err.stack);
  res.status(err.number);
  res.send(err.clientMessage);
};
