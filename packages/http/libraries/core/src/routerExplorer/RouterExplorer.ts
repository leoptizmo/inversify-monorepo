import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';
import { Container } from 'inversify';

import { InversifyHttpAdapterError } from '../error/models/InversifyHttpAdapterError';
import { InversifyHttpAdapterErrorKind } from '../error/models/InversifyHttpAdapterErrorKind';
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
import { RouterExplorerControllerMetadata } from './model/RouterExplorerControllerMetadata';
import { RouterExplorerControllerMethodMetadata } from './model/RouterExplorerControllerMethodMetadata';

export class RouterExplorer {
  #routerExplorerControllerMetadataList:
    | RouterExplorerControllerMetadata[]
    | undefined;
  readonly #container: Container;

  constructor(container: Container) {
    this.#container = container;
    this.#routerExplorerControllerMetadataList = undefined;
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
      if (
        (controllerMetadata.controllerName === undefined &&
          this.#container.isBound(controllerMetadata.target)) ||
        (controllerMetadata.controllerName !== undefined &&
          this.#container.isBound(controllerMetadata.target, {
            name: controllerMetadata.controllerName,
          }))
      ) {
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

    return {
      controllerMethodMetadataList:
        await this.#buildRouterExplorerControllerMethodMetadataList(
          controllerMetadata,
          controllerMethodMetadataList ?? [],
        ),
      guardList: controllerGuardList,
      middlewareList: controllerMiddlewareList,
      path: controllerMetadata.path,
      target: controllerMetadata.target,
    };
  }

  async #buildRouterExplorerControllerMethodMetadataList(
    controllerMetadata: ControllerMetadata,
    controllerMethodMetadataList: ControllerMethodMetadata[],
  ): Promise<RouterExplorerControllerMethodMetadata[]> {
    return Promise.all(
      controllerMethodMetadataList.map(
        async (controllerMethodMetadata: ControllerMethodMetadata) =>
          this.#buildRouterExplorerControllerMethodMetadata(
            controllerMetadata,
            controllerMethodMetadata,
          ),
      ),
    );
  }

  async #buildRouterExplorerControllerMethodMetadata(
    controllerMetadata: ControllerMetadata,
    controllerMethodMetadata: ControllerMethodMetadata,
  ): Promise<RouterExplorerControllerMethodMetadata> {
    const controller: Controller =
      controllerMetadata.controllerName === undefined
        ? await this.#container.getAsync(controllerMetadata.target)
        : await this.#container.getAsync(controllerMetadata.target, {
            name: controllerMetadata.controllerName,
          });

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

    return {
      guardList: controllerMethodGuardList,
      methodKey: controllerMethodMetadata.methodKey,
      middlewareList: controllerMethodMiddlewareList,
      parameterMetadataList: controllerMethodParameterMetadataList ?? [],
      path: controllerMethodMetadata.path,
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
