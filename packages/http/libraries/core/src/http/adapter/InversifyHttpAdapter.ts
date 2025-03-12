import { ConsoleLogger, Logger } from '@inversifyjs/logger';
import { Container } from 'inversify';

import { RouterExplorerControllerMethodMetadata } from '../../routerExplorer/model/RouterExplorerControllerMethodMetadata';
import { RouterExplorer } from '../../routerExplorer/RouterExplorer';
import { Guard } from '../guard/Guard';
import { ControllerFunction } from '../models/ControllerFunction';
import { ControllerMethodParameterMetadata } from '../models/ControllerMethodParameterMetadata';
import { ControllerResponse } from '../models/ControllerResponse';
import { HttpAdapterOptions } from '../models/HttpAdapterOptions';
import { InternalHttpAdapterOptions } from '../models/InternalHttpAdapterOptions';
import { Middleware } from '../models/Middleware';
import { RequestHandler } from '../models/RequestHandler';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { RouterParams } from '../models/RouterParams';
import { ForbiddenHttpResponse } from '../responses/error/ForbiddenHttpResponse';
import { InternalServerErrorHttpResponse } from '../responses/error/InternalServerErrorHttpResponse';
import { HttpResponse } from '../responses/HttpResponse';
import { HttpStatusCode } from '../responses/HttpStatusCode';

export abstract class InversifyHttpAdapter<
  TRequest,
  TResponse,
  TNextFunction extends (err?: unknown) => void,
> {
  readonly #container: Container;
  readonly #httpAdapterOptions: InternalHttpAdapterOptions;
  readonly #logger: Logger;
  readonly #routerExplorer: RouterExplorer;

  constructor(container: Container, httpAdapterOptions?: HttpAdapterOptions) {
    this.#container = container;
    this.#routerExplorer = new RouterExplorer(container);
    this.#logger = new ConsoleLogger();
    this.#httpAdapterOptions =
      this.#parseHttpAdapterOptions(httpAdapterOptions);
  }

  protected _buildServer(): void {
    this.#registerControllers();
  }

  #parseHttpAdapterOptions(
    httpAdapterOptions?: HttpAdapterOptions,
  ): InternalHttpAdapterOptions {
    return {
      logger: httpAdapterOptions?.logger ?? true,
    };
  }

  #registerControllers(): void {
    for (const routerExplorerControllerMetadata of this.#routerExplorer
      .routerExplorerControllerMetadataList) {
      this._buildRouter(
        routerExplorerControllerMetadata.path,
        this.#buildHandlers(
          routerExplorerControllerMetadata.controllerMethodMetadataList,
        ),
        this.#getMiddlewareHandlerFromMetadata(
          routerExplorerControllerMetadata.middlewareList,
        ),
        this.#getGuardHandlerFromMetadata(
          routerExplorerControllerMetadata.guardList,
        ),
      );

      if (this.#httpAdapterOptions.logger) {
        this.#printController(
          routerExplorerControllerMetadata.target.name,
          routerExplorerControllerMetadata.path,
          routerExplorerControllerMetadata.controllerMethodMetadataList,
        );
      }
    }
  }

  #buildHandlers(
    routerExplorerControllerMethodMetadata: RouterExplorerControllerMethodMetadata[],
  ): RouterParams<TRequest, TResponse, TNextFunction>[] {
    return routerExplorerControllerMethodMetadata.map(
      (
        routerExplorerControllerMethodMetadata: RouterExplorerControllerMethodMetadata,
      ) => ({
        guardList: this.#getGuardHandlerFromMetadata(
          routerExplorerControllerMethodMetadata.guardList,
        ),
        handler: this.#buildHandler(
          routerExplorerControllerMethodMetadata.parameterMetadataList,
          routerExplorerControllerMethodMetadata.target,
          routerExplorerControllerMethodMetadata.statusCode,
        ),
        middlewareList: this.#getMiddlewareHandlerFromMetadata(
          routerExplorerControllerMethodMetadata.middlewareList,
        ),
        path: routerExplorerControllerMethodMetadata.path,
        requestMethodType:
          routerExplorerControllerMethodMetadata.requestMethodType,
      }),
    );
  }

  #buildHandler(
    controllerMethodParameterMetadataList: ControllerMethodParameterMetadata[],
    controllerFunction: ControllerFunction,
    statusCode: HttpStatusCode | undefined,
  ): RequestHandler<TRequest, TResponse, TNextFunction> {
    return async (
      req: TRequest,
      res: TResponse,
      next: TNextFunction,
    ): Promise<unknown> => {
      try {
        const handlerParams: unknown[] = await Promise.all(
          this.#buildHandlerParams(
            controllerMethodParameterMetadataList,
            req,
            res,
            next,
          ),
        );

        const value: ControllerResponse = await controllerFunction(
          ...handlerParams,
        );

        return this.#reply(req, res, value, statusCode);
      } catch (_error: unknown) {
        return this.#reply(req, res, new InternalServerErrorHttpResponse());
      }
    };
  }

  #buildHandlerParams(
    controllerMethodParameterMetadataList: ControllerMethodParameterMetadata[],
    request: TRequest,
    response: TResponse,
    next: TNextFunction,
  ): Promise<unknown>[] {
    return controllerMethodParameterMetadataList.map(
      async (
        controllerMethodParameterMetadata: ControllerMethodParameterMetadata,
      ) => {
        switch (controllerMethodParameterMetadata.parameterType) {
          case RequestMethodParameterType.BODY:
            return this._getBody(
              request,
              controllerMethodParameterMetadata.parameterName,
            );
          case RequestMethodParameterType.REQUEST: {
            return request;
          }
          case RequestMethodParameterType.RESPONSE: {
            return response;
          }
          case RequestMethodParameterType.PARAMS: {
            return this._getParams(
              request,
              controllerMethodParameterMetadata.parameterName,
            );
          }
          case RequestMethodParameterType.QUERY: {
            return this._getQuery(
              request,
              controllerMethodParameterMetadata.parameterName,
            );
          }
          case RequestMethodParameterType.HEADERS: {
            return this._getHeaders(
              request,
              controllerMethodParameterMetadata.parameterName,
            );
          }
          case RequestMethodParameterType.COOKIES: {
            return this._getCookies(
              request,
              controllerMethodParameterMetadata.parameterName,
            );
          }
          case RequestMethodParameterType.NEXT: {
            return next;
          }
        }
      },
    );
  }

  #reply(
    request: TRequest,
    response: TResponse,
    value: ControllerResponse,
    statusCode?: HttpStatusCode,
  ): unknown {
    let body: object | string | number | boolean | undefined = undefined;
    let httpStatusCode: HttpStatusCode | undefined = statusCode;

    if (HttpResponse.is(value)) {
      body = value.body;
      httpStatusCode = value.statusCode;
    } else {
      body = value;
    }

    if (httpStatusCode !== undefined) {
      this._setStatus(request, response, httpStatusCode);
    }

    if (typeof body === 'string') {
      return this._replyText(request, response, body);
    } else if (body === undefined || typeof body === 'object') {
      return this._replyJson(request, response, body);
    } else {
      return this._replyText(request, response, JSON.stringify(body));
    }
  }

  #getMiddlewareHandlerFromMetadata(
    middlewareList: NewableFunction[] | undefined,
  ): RequestHandler<TRequest, TResponse, TNextFunction>[] | undefined {
    let requestHandlerList:
      | RequestHandler<TRequest, TResponse, TNextFunction>[]
      | undefined = undefined;

    if (middlewareList !== undefined) {
      requestHandlerList = middlewareList.map(
        (newableFunction: NewableFunction) => {
          const middleware: Middleware<TRequest, TResponse, TNextFunction> =
            this.#container.get(newableFunction);

          return middleware.execute.bind(middleware);
        },
      );
    }

    return requestHandlerList;
  }

  #getGuardHandlerFromMetadata(
    guardList: NewableFunction[] | undefined,
  ): RequestHandler<TRequest, TResponse, TNextFunction>[] | undefined {
    let guardHandlerList:
      | RequestHandler<TRequest, TResponse, TNextFunction>[]
      | undefined = undefined;

    if (guardList !== undefined) {
      guardHandlerList = guardList.map((newableFunction: NewableFunction) => {
        const guard: Guard<TRequest> = this.#container.get(newableFunction);

        return async (
          request: TRequest,
          response: TResponse,
          next: TNextFunction,
        ) => {
          const activate: boolean = await guard.activate(request);

          if (!activate) {
            this.#reply(
              request,
              response,
              guard.getHttpResponse !== undefined
                ? guard.getHttpResponse()
                : new ForbiddenHttpResponse(),
            );
          } else {
            next();
          }
        };
      });
    }

    return guardHandlerList;
  }

  #printController(
    controllerName: string,
    path: string,
    routerExplorerControllerMethodMetadataList: RouterExplorerControllerMethodMetadata[],
  ): void {
    this.#logger.info(`${controllerName} {${path}}:`);

    for (const controllerMethodMetadata of routerExplorerControllerMethodMetadataList) {
      this.#logger.info(
        `.${controllerMethodMetadata.target.name}() mapped {${controllerMethodMetadata.path}, ${controllerMethodMetadata.requestMethodType}}`,
      );
    }
  }

  public abstract build(): unknown;

  protected abstract _getBody(
    request: TRequest,
    parameterName?: string | symbol,
  ): Promise<unknown>;

  protected abstract _getParams(
    request: TRequest,
    parameterName?: string | symbol,
  ): unknown;

  protected abstract _getQuery(
    request: TRequest,
    parameterName?: string | symbol,
  ): unknown;

  protected abstract _getHeaders(
    request: TRequest,
    parameterName?: string | symbol,
  ): unknown;

  protected abstract _getCookies(
    request: TRequest,
    parameterName?: string | symbol,
  ): unknown;

  protected abstract _replyText(
    request: TRequest,
    response: TResponse,
    value: string,
  ): unknown;

  protected abstract _replyJson(
    request: TRequest,
    response: TResponse,
    value?: object,
  ): unknown;

  protected abstract _setStatus(
    request: TRequest,
    response: TResponse,
    statusCode: HttpStatusCode,
  ): void;

  protected abstract _buildRouter(
    path: string,
    routerParams: RouterParams<TRequest, TResponse, TNextFunction>[],
    guardList: RequestHandler<TRequest, TResponse, TNextFunction>[] | undefined,
    middlewareList:
      | RequestHandler<TRequest, TResponse, TNextFunction>[]
      | undefined,
  ): unknown;
}
