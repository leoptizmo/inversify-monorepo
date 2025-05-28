import {
  Binding,
  BindingConstraints,
  BindingScope,
  DeactivationParams,
  resolveBindingsDeactivations,
  resolveServiceDeactivations,
} from '@gritcode/inversifyjs-core';
import {
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from '@inversifyjs/common';

import { isBindingIdentifier } from '../../binding/calculations/isBindingIdentifier';
import { BindToFluentSyntax } from '../../binding/models/BindingFluentSyntax';
import { BindToFluentSyntaxImplementation } from '../../binding/models/BindingFluentSyntaxImplementation';
import { BindingIdentifier } from '../../binding/models/BindingIdentifier';
import { getFirstIterableResult } from '../../common/calculations/getFirstIterableResult';
import { InversifyContainerError } from '../../error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from '../../error/models/InversifyContainerErrorKind';
import { IsBoundOptions } from '../models/isBoundOptions';
import { ServiceReferenceManager } from './ServiceReferenceManager';

export class BindingManager {
  readonly #deactivationParams: DeactivationParams;
  readonly #defaultScope: BindingScope;
  readonly #serviceReferenceManager: ServiceReferenceManager;

  constructor(
    deactivationParams: DeactivationParams,
    defaultScope: BindingScope,
    serviceReferenceManager: ServiceReferenceManager,
  ) {
    this.#deactivationParams = deactivationParams;
    this.#defaultScope = defaultScope;
    this.#serviceReferenceManager = serviceReferenceManager;
  }

  public bind<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): BindToFluentSyntax<T> {
    return new BindToFluentSyntaxImplementation(
      (binding: Binding): void => {
        this.#setBinding(binding);
      },
      undefined,
      this.#defaultScope,
      serviceIdentifier,
    );
  }

  public isBound(
    serviceIdentifier: ServiceIdentifier,
    options?: IsBoundOptions,
  ): boolean {
    const bindings: Iterable<Binding<unknown>> | undefined =
      this.#serviceReferenceManager.bindingService.get(serviceIdentifier);

    return this.#isAnyValidBinding(serviceIdentifier, bindings, options);
  }

  public isCurrentBound(
    serviceIdentifier: ServiceIdentifier,
    options?: IsBoundOptions,
  ): boolean {
    const bindings: Iterable<Binding<unknown>> | undefined =
      this.#serviceReferenceManager.bindingService.getNonParentBindings(
        serviceIdentifier,
      );

    return this.#isAnyValidBinding(serviceIdentifier, bindings, options);
  }

  public async rebind<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): Promise<BindToFluentSyntax<T>> {
    await this.unbind(serviceIdentifier);

    return this.bind(serviceIdentifier);
  }

  public rebindSync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): BindToFluentSyntax<T> {
    this.unbindSync(serviceIdentifier);

    return this.bind(serviceIdentifier);
  }

  public async unbind(
    identifier: BindingIdentifier | ServiceIdentifier,
  ): Promise<void> {
    await this.#unbind(identifier);
  }

  public async unbindAll(): Promise<void> {
    const nonParentBoundServiceIds: ServiceIdentifier[] = [
      ...this.#serviceReferenceManager.bindingService.getNonParentBoundServices(),
    ];

    await Promise.all(
      nonParentBoundServiceIds.map(
        async (serviceId: ServiceIdentifier): Promise<void> =>
          resolveServiceDeactivations(this.#deactivationParams, serviceId),
      ),
    );

    /*
     * Removing service related objects here so unbindAll is deterministic.
     *
     * Removing service related objects as soon as resolveModuleDeactivations takes
     * effect leads to module deactivations not triggering previously deleted
     * deactivations, introducing non determinism depending in the order in which
     * services are deactivated.
     */
    for (const serviceId of nonParentBoundServiceIds) {
      this.#serviceReferenceManager.activationService.removeAllByServiceId(
        serviceId,
      );
      this.#serviceReferenceManager.bindingService.removeAllByServiceId(
        serviceId,
      );
      this.#serviceReferenceManager.deactivationService.removeAllByServiceId(
        serviceId,
      );
    }

    this.#serviceReferenceManager.planResultCacheService.clearCache();
  }

  public unbindSync(identifier: BindingIdentifier | ServiceIdentifier): void {
    const result: void | Promise<void> = this.#unbind(identifier);

    if (result !== undefined) {
      this.#throwUnexpectedAsyncUnbindOperation(identifier);
    }
  }

  #setBinding(binding: Binding): void {
    this.#serviceReferenceManager.bindingService.set(binding);
    this.#serviceReferenceManager.planResultCacheService.clearCache();
  }

  #throwUnexpectedAsyncUnbindOperation(
    identifier: BindingIdentifier | ServiceIdentifier,
  ): never {
    let errorMessage: string;

    if (isBindingIdentifier(identifier)) {
      const bindingsById: Iterable<Binding<unknown>> | undefined =
        this.#serviceReferenceManager.bindingService.getById(identifier.id);

      const bindingServiceIdentifier: ServiceIdentifier | undefined =
        getFirstIterableResult(bindingsById)?.serviceIdentifier;

      if (bindingServiceIdentifier === undefined) {
        errorMessage =
          'Unexpected asynchronous deactivation when unbinding binding identifier. Consider using Container.unbind() instead.';
      } else {
        errorMessage = `Unexpected asynchronous deactivation when unbinding "${stringifyServiceIdentifier(bindingServiceIdentifier)}" binding. Consider using Container.unbind() instead.`;
      }
    } else {
      errorMessage = `Unexpected asynchronous deactivation when unbinding "${stringifyServiceIdentifier(identifier)}" service. Consider using Container.unbind() instead.`;
    }

    throw new InversifyContainerError(
      InversifyContainerErrorKind.invalidOperation,
      errorMessage,
    );
  }

  #unbind(
    identifier: BindingIdentifier | ServiceIdentifier,
  ): void | Promise<void> {
    if (isBindingIdentifier(identifier)) {
      return this.#unbindBindingIdentifier(identifier);
    }

    return this.#unbindServiceIdentifier(identifier);
  }

  #unbindBindingIdentifier(
    identifier: BindingIdentifier,
  ): void | Promise<void> {
    const bindings: Iterable<Binding<unknown>> | undefined =
      this.#serviceReferenceManager.bindingService.getById(identifier.id);

    const result: void | Promise<void> = resolveBindingsDeactivations(
      this.#deactivationParams,
      bindings,
    );

    if (result === undefined) {
      this.#clearAfterUnbindBindingIdentifier(identifier);
    } else {
      return result.then((): void => {
        this.#clearAfterUnbindBindingIdentifier(identifier);
      });
    }
  }

  #clearAfterUnbindBindingIdentifier(identifier: BindingIdentifier): void {
    this.#serviceReferenceManager.bindingService.removeById(identifier.id);
    this.#serviceReferenceManager.planResultCacheService.clearCache();
  }

  #unbindServiceIdentifier(
    identifier: ServiceIdentifier,
  ): void | Promise<void> {
    const result: void | Promise<void> = resolveServiceDeactivations(
      this.#deactivationParams,
      identifier,
    );

    if (result === undefined) {
      this.#clearAfterUnbindServiceIdentifier(identifier);
    } else {
      return result.then((): void => {
        this.#clearAfterUnbindServiceIdentifier(identifier);
      });
    }
  }

  #clearAfterUnbindServiceIdentifier(identifier: ServiceIdentifier): void {
    this.#serviceReferenceManager.activationService.removeAllByServiceId(
      identifier,
    );
    this.#serviceReferenceManager.bindingService.removeAllByServiceId(
      identifier,
    );
    this.#serviceReferenceManager.deactivationService.removeAllByServiceId(
      identifier,
    );

    this.#serviceReferenceManager.planResultCacheService.clearCache();
  }

  #isAnyValidBinding(
    serviceIdentifier: ServiceIdentifier,
    bindings: Iterable<Binding<unknown>> | undefined,
    options?: IsBoundOptions,
  ): boolean {
    if (bindings === undefined) {
      return false;
    }

    const bindingConstraints: BindingConstraints = {
      getAncestor: () => undefined,
      name: options?.name,
      serviceIdentifier,
      tags: new Map(),
    };

    if (options?.tag !== undefined) {
      bindingConstraints.tags.set(options.tag.key, options.tag.value);
    }

    for (const binding of bindings) {
      if (binding.isSatisfiedBy(bindingConstraints)) {
        return true;
      }
    }

    return false;
  }
}
