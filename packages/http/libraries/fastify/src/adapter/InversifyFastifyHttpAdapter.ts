import {
  HttpAdapterOptions,
  HttpStatusCode,
  InversifyHttpAdapter,
  RequestHandler,
  RouterParams,
} from '@inversifyjs/http-core';
import {
  fastify,
  FastifyInstance,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
  RouteHandlerMethod,
} from 'fastify';
import { Container } from 'inversify';

export class InversifyFastifyHttpAdapter extends InversifyHttpAdapter<
  FastifyRequest,
  FastifyReply,
  (err?: Error) => void
> {
  readonly #app: FastifyInstance;

  constructor(
    container: Container,
    httpAdapterOptions?: HttpAdapterOptions,
    customApp?: FastifyInstance,
  ) {
    super(container, httpAdapterOptions);
    this.#app = customApp ?? fastify();
  }

  public async build(): Promise<FastifyInstance> {
    await this._buildServer();

    return this.#app;
  }

  protected async _getBody(
    request: FastifyRequest,
    parameterName?: string,
  ): Promise<unknown> {
    return parameterName !== undefined
      ? (request.body as Record<string, unknown>)[parameterName]
      : request.body;
  }

  protected override _getParams(
    request: FastifyRequest,
    parameterName?: string,
  ): unknown {
    return parameterName !== undefined
      ? (request.params as Record<string, unknown>)[parameterName]
      : request.params;
  }
  protected override _getQuery(
    request: FastifyRequest,
    parameterName?: string,
  ): unknown {
    return parameterName !== undefined
      ? (request.query as Record<string, unknown>)[parameterName]
      : request.query;
  }

  protected override _getHeaders(
    request: FastifyRequest,
    parameterName?: string,
  ): unknown {
    return parameterName !== undefined
      ? request.headers[parameterName]
      : request.headers;
  }

  protected override _getCookies(
    _request: FastifyRequest,
    _parameterName?: string | symbol,
  ): unknown {
    return undefined;
  }

  protected override _replyText(
    _request: FastifyRequest,
    response: FastifyReply,
    value: string,
  ): unknown {
    return response.send(value);
  }

  protected override _replyJson(
    _request: FastifyRequest,
    response: FastifyReply,
    value?: object,
  ): unknown {
    return response.send(value);
  }

  protected override _setStatus(
    _request: FastifyRequest,
    response: FastifyReply,
    statusCode: HttpStatusCode,
  ): void {
    response.status(statusCode);
  }

  protected override _buildRouter(
    path: string,
    routerParams: RouterParams<
      FastifyRequest,
      FastifyReply,
      (err?: Error) => void
    >[],
    guardList:
      | RequestHandler<FastifyRequest, FastifyReply, (err?: Error) => void>[]
      | undefined,
    middlewareList:
      | RequestHandler<FastifyRequest, FastifyReply, (err?: Error) => void>[]
      | undefined,
  ): void {
    const router: FastifyPluginCallback = (
      fastifyInstance: FastifyInstance,
      _opts: Record<string, unknown>,
      done: () => void,
    ) => {
      const orderedMiddlewareList:
        | RequestHandler<FastifyRequest, FastifyReply, (err?: Error) => void>[]
        | undefined = this.#orderMiddlewares(guardList, middlewareList);

      const fastifySyncMiddlewareList: preHandlerHookHandler[] =
        this.#buildFastifySyncMiddlewares(orderedMiddlewareList ?? []);

      for (const middleware of fastifySyncMiddlewareList) {
        fastifyInstance.addHook('preHandler', middleware);
      }

      for (const routerParam of routerParams) {
        const orderedMiddlewareList:
          | RequestHandler<
              FastifyRequest,
              FastifyReply,
              (err?: Error) => void
            >[]
          | undefined = this.#orderMiddlewares(
          routerParam.guardList,
          routerParam.middlewareList,
        );

        const fastifySyncMiddlewareList: preHandlerHookHandler[] =
          this.#buildFastifySyncMiddlewares(orderedMiddlewareList ?? []);

        fastifyInstance.route({
          handler: routerParam.handler as RouteHandlerMethod,
          method: routerParam.requestMethodType,
          preHandler: fastifySyncMiddlewareList,
          url: routerParam.path,
        });
      }

      done();
    };

    this.#app.register(router, { prefix: path });
  }

  #orderMiddlewares(
    guardList:
      | RequestHandler<FastifyRequest, FastifyReply, (err?: Error) => void>[]
      | undefined,
    middlewareList:
      | RequestHandler<FastifyRequest, FastifyReply, (err?: Error) => void>[]
      | undefined,
  ):
    | RequestHandler<FastifyRequest, FastifyReply, (err?: Error) => void>[]
    | undefined {
    let orderedMiddlewareList:
      | RequestHandler<FastifyRequest, FastifyReply, (err?: Error) => void>[]
      | undefined = undefined;

    if (guardList !== undefined || middlewareList !== undefined) {
      orderedMiddlewareList = [];

      if (guardList !== undefined) {
        orderedMiddlewareList.push(...guardList);
      }

      if (middlewareList !== undefined) {
        orderedMiddlewareList.push(...middlewareList);
      }
    }

    return orderedMiddlewareList;
  }

  #buildFastifySyncMiddlewares(
    middlewareList: RequestHandler<
      FastifyRequest,
      FastifyReply,
      (err?: Error) => void
    >[],
  ): preHandlerHookHandler[] {
    return middlewareList.map(
      (
        middleware: RequestHandler<
          FastifyRequest,
          FastifyReply,
          (err?: Error) => void
        >,
      ) =>
        (
          request: FastifyRequest,
          reply: FastifyReply,
          done: (err?: Error) => void,
        ) => {
          void Promise.resolve(middleware(request, reply, done));
        },
    );
  }
}
