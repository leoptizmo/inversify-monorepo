import { Middleware } from '@inversifyjs/http-core';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';

@injectable()
export class SuccessfulExpressMiddleware
  implements Middleware<Request, Response, NextFunction, void>
{
  public async execute(
    _request: Request,
    _response: Response,
    next: NextFunction,
  ): Promise<void> {
    next();
  }
}
