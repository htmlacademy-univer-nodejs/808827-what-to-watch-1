import {HttpMethod} from './http-method.enum.js';
import {NextFunction, Request, Response} from 'express';
import { MiddlewareInterface } from './middleware.interface.js';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  middlewares?: MiddlewareInterface[];
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
