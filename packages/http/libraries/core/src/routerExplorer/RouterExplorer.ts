import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';
import { Container } from 'inversify';

import { InversifyHttpAdapterError } from '../error/models/InversifyHttpAdapterError';
import { InversifyHttpAdapterErrorKind } from '../error/models/InversifyHttpAdapterErrorKind';
import { ApplyMiddlewareOptions } from '../http/models/ApplyMiddlewareOptions';
import { Controller } from '../http/models/Controller';
import { ControllerFunction } from '../http/models/ControllerFunction';
import { ControllerMetadata } from '../http/models/ControllerMetadata';
import { ControllerMethodMetadata } from '../http/models/ControllerMethodMetadata';
import { ControllerMethodParameterMetadata } from '../http/models/ControllerMethodParameterMetadata';
import { HttpStatusCode } from '../http/responses/HttpStatusCode';
import { controllerGuardMetadataReflectKey } from '../reflectMetadata/data/controllerGuardMetadataReflectKey';
import { controllerMetadataReflectKey } from '../reflectMetadata/data/controllerMetadataReflectKey';
import { controllerMethodGuardMetadataReflectKey } from '../reflectMetadata/data/controllerMethodGuardMetadataReflectKey';
import { controllerMethodMetadataReflectKey } from '../reflectMetadata/data/controllerMethodMetadataReflectKey';
import { controllerMethodMiddlewareMetadataReflectKey } from '../reflectMetadata/data/controllerMethodMiddlewareMetadataReflectKey';
import { controllerMethodParameterMetadataReflectKey } from '../reflectMetadata/data/controllerMethodParameterMetadataReflectKey';
import { controllerMethodStatusCodeMetadataReflectKey } from '../reflectMetadata/data/controllerMethodStatusCodeMetadataReflectKey';
import { controllerMiddlewareMetadataReflectKey } from '../reflectMetadata/data/controllerMiddlewareMetadataReflectKey';
import { ApplyMiddlewareOptionsToNewableFunctionConverter } from './converter/ApplyMiddlewareOptionsToNewableFunctionConverter';
import { Converter } from './converter/Converter';
import { RouterExplorerControllerMetadata } from './model/RouterExplorerControllerMetadata';
import { RouterExplorerControllerMethodMetadata } from './model/RouterExplorerControllerMethodMetadata';

export class RouterExplorer {
  #routerExplorerControllerMetadataList:
    | RouterExplorerControllerMetadata[]
    | undefined;
  readonly #container: Container;
  readonly #applyMiddlewareOptionsToNewableFunctionConverter: Converter<
    (NewableFunction | ApplyMiddlewareOptions)[],
    {
      preHandlerMiddlewareList: NewableFunction[];
      postHandlerMiddlewareList: NewableFunction[];
    }
  >;

  constructor(container: Container) {
    this.#container = container;
    this.#routerExplorerControllerMetadataList = undefined;
    this.#applyMiddlewareOptionsToNewableFunctionConverter =
      new ApplyMiddlewareOptionsToNewableFunctionConverter();
  }

  public async getMetadataList(): Promise<RouterExplorerControllerMetadata[]> {
    if (this.#routerExplorerControllerMetadataList === undefined) {
      this.#routerExplorerControllerMetadataList =
        await this.#buildControllerMetadataList();
    }

    return this.#routerExplorerControllerMetadataList;
  }

  async #buildControllerMetadataList(): Promise<
    RouterExplorerControllerMetadata[]
  > {
    const controllerMetadataList: ControllerMetadata[] | undefined =
      this.#exploreControllers();

    if (controllerMetadataList === undefined) {
      throw new InversifyHttpAdapterError(
        InversifyHttpAdapterErrorKind.noControllerFound,
      );
    }

    const routerExplorerControllerMetadataList: RouterExplorerControllerMetadata[] =
      [];

    for (const controllerMetadata of controllerMetadataList) {
      if (this.#container.isBound(controllerMetadata.target)) {
        routerExplorerControllerMetadataList.push(
          await this.#buildRouterExplorerControllerMetadata(controllerMetadata),
        );
      }
    }

    return routerExplorerControllerMetadataList;
  }

  async #buildRouterExplorerControllerMetadata(
    controllerMetadata: ControllerMetadata,
  ): Promise<RouterExplorerControllerMetadata> {
    const controllerMethodMetadataList: ControllerMethodMetadata[] | undefined =
      this.#exploreControllerMethodMetadataList(controllerMetadata.target);

    const controllerGuardList: NewableFunction[] | undefined =
      this.#exploreControllerGuardList(controllerMetadata.target);

    const controllerMiddlewareList: NewableFunction[] | undefined =
      this.#exploreControllerMiddlewareList(controllerMetadata.target);

    const controller: Controller = await this.#container.getAsync(
      controllerMetadata.target,
    );

    const newableFunctionMiddleware: {
      postHandlerMiddlewareList: NewableFunction[];
      preHandlerMiddlewareList: NewableFunction[];
    } = this.#applyMiddlewareOptionsToNewableFunctionConverter.convert(
      controllerMiddlewareList ?? [],
    );

    return {
      controllerMethodMetadataList:
        this.#buildRouterExplorerControllerMethodMetadataList(
          controller,
          controllerMethodMetadataList ?? [],
        ),
      guardList: controllerGuardList,
      path: controllerMetadata.path,
      postHandlerMiddlewareList:
        newableFunctionMiddleware.postHandlerMiddlewareList,
      preHandlerMiddlewareList:
        newableFunctionMiddleware.preHandlerMiddlewareList,
      target: controllerMetadata.target,
    };
  }

  #buildRouterExplorerControllerMethodMetadataList(
    controller: Controller,
    controllerMethodMetadataList: ControllerMethodMetadata[],
  ): RouterExplorerControllerMethodMetadata[] {
    return controllerMethodMetadataList.map(
      (controllerMethodMetadata: ControllerMethodMetadata) =>
        this.#buildRouterExplorerControllerMethodMetadata(
          controller,
          controllerMethodMetadata,
        ),
    );
  }

  #buildRouterExplorerControllerMethodMetadata(
    controller: Controller,
    controllerMethodMetadata: ControllerMethodMetadata,
  ): RouterExplorerControllerMethodMetadata {
    const targetFunction: ControllerFunction = controller[
      controllerMethodMetadata.methodKey
    ] as ControllerFunction;

    const controllerMethodParameterMetadataList:
      | ControllerMethodParameterMetadata[]
      | undefined =
      this.#exploreControllerMethodParameterMetadataList(targetFunction);

    const controllerMethodStatusCode: HttpStatusCode | undefined =
      this.#exploreControllerMethodStatusCodeMetadata(targetFunction);

    const controllerMethodGuardList: NewableFunction[] | undefined =
      this.#exploreControllerMethodGuardList(targetFunction);

    const controllerMethodMiddlewareList: NewableFunction[] | undefined =
      this.#exploreControllerMethodMiddlewareList(targetFunction);

    const newableFunctionMiddleware: {
      postHandlerMiddlewareList: NewableFunction[];
      preHandlerMiddlewareList: NewableFunction[];
    } = this.#applyMiddlewareOptionsToNewableFunctionConverter.convert(
      controllerMethodMiddlewareList ?? [],
    );

    return {
      guardList: controllerMethodGuardList,
      methodKey: controllerMethodMetadata.methodKey,
      parameterMetadataList: controllerMethodParameterMetadataList ?? [],
      path: controllerMethodMetadata.path,
      postHandlerMiddlewareList:
        newableFunctionMiddleware.postHandlerMiddlewareList,
      preHandlerMiddlewareList:
        newableFunctionMiddleware.preHandlerMiddlewareList,
      requestMethodType: controllerMethodMetadata.requestMethodType,
      statusCode: controllerMethodStatusCode,
    };
  }

  #exploreControllers(): ControllerMetadata[] | undefined {
    return getReflectMetadata(Reflect, controllerMetadataReflectKey);
  }

  #exploreControllerMethodMetadataList(
    controller: NewableFunction,
  ): ControllerMethodMetadata[] | undefined {
    return getReflectMetadata(controller, controllerMethodMetadataReflectKey);
  }

  #exploreControllerMethodParameterMetadataList(
    controllerMethod: ControllerFunction,
  ): ControllerMethodParameterMetadata[] | undefined {
    return getReflectMetadata(
      controllerMethod,
      controllerMethodParameterMetadataReflectKey,
    );
  }

  #exploreControllerMethodStatusCodeMetadata(
    controllerMethod: ControllerFunction,
  ): HttpStatusCode | undefined {
    return getReflectMetadata(
      controllerMethod,
      controllerMethodStatusCodeMetadataReflectKey,
    );
  }

  #exploreControllerMethodGuardList(
    controllerMethod: ControllerFunction,
  ): NewableFunction[] | undefined {
    return getReflectMetadata(
      controllerMethod,
      controllerMethodGuardMetadataReflectKey,
    );
  }

  #exploreControllerMethodMiddlewareList(
    controllerMethod: ControllerFunction,
  ): NewableFunction[] | undefined {
    return getReflectMetadata(
      controllerMethod,
      controllerMethodMiddlewareMetadataReflectKey,
    );
  }

  #exploreControllerMiddlewareList(
    controller: NewableFunction,
  ): NewableFunction[] | undefined {
    return getReflectMetadata(
      controller,
      controllerMiddlewareMetadataReflectKey,
    );
  }

  #exploreControllerGuardList(
    controller: NewableFunction,
  ): NewableFunction[] | undefined {
    return getReflectMetadata(controller, controllerGuardMetadataReflectKey);
  }
}
