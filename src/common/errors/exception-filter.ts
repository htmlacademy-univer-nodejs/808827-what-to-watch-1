import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import HttpError from './http-error.js';
import { createErrorObject } from '../../utils/common.js';
import { ServiceError } from '../../types/service-error.enum.js';
import ValidationError from './validation-error.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface
  ) {
    this.logger.info('Register ExceptionFilter');
  }

  private httpErrorHandler(
    error: HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    this.logger.error(
      `[${error.detail}]: ${error.httpStatusCode} — ${error.message}`
    );
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.HttpError, error.message));
  }

  public validationErrorhandler(
    error: ValidationError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    this.logger.error(`[Validation Error]: ${error.message}`);
    error.details.forEach((errorField) =>
      this.logger.error(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(error.httpStatusCode)
      .json(
        createErrorObject(
          ServiceError.ValidationError,
          error.message,
          error.details
        )
      );
  }

  private otherErrorHandler(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    // console.log(error, res)
    this.logger.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ServiceError.ServiceError, error.message));
  }

  public catch(
    error: Error | HttpError | ValidationError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (error instanceof HttpError) {
      return this.httpErrorHandler(error, req, res, next);
    }
    if (error instanceof ValidationError) {
      return this.validationErrorhandler(error, req, res, next);
    }
    this.otherErrorHandler(error, req, res, next);
  }
}
