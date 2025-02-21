import { Container } from '@inversifyjs/container';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerMetadata } from '../models/ControllerMetadata';
import { ControllerMethodMetadata } from '../models/ControllerMethodMetadata';
import { ControllerMethodParameterMetadata } from '../models/ControllerMethodParameterMetadata';
import { METADATA_KEY } from '../models/MetadataKey';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { RouterParams } from '../models/RouterParams';

export abstract class InversifyHttpAdapter<
  TRequest,
  TResponse,
  TNextFunction extends (err?: unknown) => void,
> {
  readonly #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  protected _buildServer(): void {
    this.#registerControllers();
  }

  #registerControllers(): void {
    const controllerMetadataList: ControllerMetadata[] | undefined =
      getReflectMetadata(Reflect, METADATA_KEY.controller);

    if (controllerMetadataList === undefined) {
      throw new Error('No controllers found');
    }

    this.#buildHandlers(controllerMetadataList);
  }

  #buildHandlers(controllerMetadataList: ControllerMetadata[]): void {
    for (const controllerMetadata of controllerMetadataList) {
      const controllerMethodMetadataList:
        | ControllerMethodMetadata[]
        | undefined = getReflectMetadata(
        controllerMetadata.target,
        METADATA_KEY.controllerMethod,
      );

      if (controllerMethodMetadataList !== undefined) {
        const routerParams: RouterParams<TRequest, TResponse, TNextFunction>[] =
          this.#buildRouterParams(
            controllerMetadata,
            controllerMethodMetadataList,
          );
        this._buildRouter(controllerMetadata.path, routerParams);
      }
    }
  }

  #buildRouterParams(
    controllerMetadata: ControllerMetadata,
    controllerMethodMetadataList: ControllerMethodMetadata[],
  ): RouterParams<TRequest, TResponse, TNextFunction>[] {
    return controllerMethodMetadataList.map(
      (controllerMethodMetadata: ControllerMethodMetadata) => {
        const parameterMetadata:
          | {
              [key: string]: ControllerMethodParameterMetadata[];
            }
          | undefined = getReflectMetadata(
          controllerMetadata.target,
          METADATA_KEY.controllerMethodParameter,
        );

        const controller: { [key: string | symbol]: () => unknown } =
          this.#container.get(controllerMetadata.target);

        return {
          handler: async (
            req: TRequest,
            res: TResponse,
            next: TNextFunction,
          ): Promise<unknown> => {
            try {
              const handlerParams: unknown[] = await Promise.all(
                this.#buildHandlerParams(
                  parameterMetadata?.[
                    controllerMethodMetadata.methodKey as string
                  ] ?? [],
                  req,
                  res,
                  next,
                ),
              );

              const value: unknown = await (
                controller[controllerMethodMetadata.methodKey] as (
                  ...args: unknown[]
                ) => unknown
              )(...handlerParams);

              return this._reply(req, res, value);
            } catch (error) {
              next(error);
              return undefined;
            }
          },
          methodKey: controllerMethodMetadata.methodKey,
          path: controllerMethodMetadata.path,
          requestMethodType: controllerMethodMetadata.requestMethodType,
        };
      },
    );
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
          case RequestMethodParameterType.PRINCIPAL: {
            throw new Error(
              'Not implemented yet: RequestMethodParameterType.PRINCIPAL case',
            );
          }
        }
      },
    );
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

  protected abstract _reply(
    request: TRequest,
    response: TResponse,
    value: unknown,
  ): unknown;

  protected abstract _buildRouter(
    path: string,
    routerParams: RouterParams<TRequest, TResponse, TNextFunction>[],
  ): unknown;
}
