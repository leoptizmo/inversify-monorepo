import {
  isPromise,
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from '@inversifyjs/common';
import {
  Binding,
  BindingActivation,
  BindingScope,
  getClassMetadata,
  GetOptions,
  GetPlanOptions,
  OptionalGetOptions,
  plan,
  PlanParams,
  PlanResult,
  ResolutionContext,
  resolve,
} from '@inversifyjs/core';

import { InversifyContainerError } from '../../error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from '../../error/models/InversifyContainerErrorKind';
import { ServiceReferenceManager } from './ServiceReferenceManager';

export class ServiceResolutionManager {
  readonly #autobind: boolean;
  readonly #defaultScope: BindingScope;
  readonly #getActivationsResolutionParam: <TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
  ) => Iterable<BindingActivation<TActivated>> | undefined;
  #getBindingsPlanParams: <TInstance>(
    serviceIdentifier: ServiceIdentifier<TInstance>,
  ) => Iterable<Binding<TInstance>> | undefined;
  #resolutionContext: ResolutionContext;
  readonly #serviceReferenceManager: ServiceReferenceManager;
  #setBindingParamsPlan: <TInstance>(binding: Binding<TInstance>) => void;

  constructor(
    serviceReferenceManager: ServiceReferenceManager,
    autobind: boolean,
    defaultScope: BindingScope,
  ) {
    this.#serviceReferenceManager = serviceReferenceManager;
    this.#resolutionContext = this.#buildResolutionContext();
    this.#autobind = autobind;
    this.#defaultScope = defaultScope;

    this.#getActivationsResolutionParam = <TActivated>(
      serviceIdentifier: ServiceIdentifier<TActivated>,
    ): Iterable<BindingActivation<TActivated>> | undefined =>
      this.#serviceReferenceManager.activationService.get(serviceIdentifier) as
        | Iterable<BindingActivation<TActivated>>
        | undefined;

    this.#getBindingsPlanParams =
      this.#serviceReferenceManager.bindingService.get.bind(
        this.#serviceReferenceManager.bindingService,
      );

    this.#setBindingParamsPlan = this.#setBinding.bind(this);

    this.#serviceReferenceManager.onReset(() => {
      this.#resetComputedProperties();
    });
  }

  public get<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options: OptionalGetOptions,
  ): T | undefined;
  public get<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options?: GetOptions,
  ): T;
  public get<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options?: GetOptions,
  ): T | undefined {
    const planResult: PlanResult = this.#buildPlanResult(
      false,
      serviceIdentifier,
      options,
    );

    const resolvedValue: T | Promise<T> | undefined =
      this.#getFromPlanResult(planResult);

    if (isPromise(resolvedValue)) {
      throw new InversifyContainerError(
        InversifyContainerErrorKind.invalidOperation,
        `Unexpected asynchronous service when resolving service "${stringifyServiceIdentifier(serviceIdentifier)}"`,
      );
    }

    return resolvedValue;
  }

  public getAll<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options?: GetOptions,
  ): T[] {
    const planResult: PlanResult = this.#buildPlanResult(
      true,
      serviceIdentifier,
      options,
    );

    const resolvedValue: T[] | Promise<T[]> =
      this.#getFromPlanResult(planResult);

    if (isPromise(resolvedValue)) {
      throw new InversifyContainerError(
        InversifyContainerErrorKind.invalidOperation,
        `Unexpected asynchronous service when resolving service "${stringifyServiceIdentifier(serviceIdentifier)}"`,
      );
    }

    return resolvedValue;
  }

  public async getAllAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options?: GetOptions,
  ): Promise<T[]> {
    const planResult: PlanResult = this.#buildPlanResult(
      true,
      serviceIdentifier,
      options,
    );

    return this.#getFromPlanResult(planResult);
  }

  public async getAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options: OptionalGetOptions,
  ): Promise<T | undefined>;
  public async getAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options?: GetOptions,
  ): Promise<T>;
  public async getAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options?: GetOptions,
  ): Promise<T | undefined> {
    const planResult: PlanResult = this.#buildPlanResult(
      false,
      serviceIdentifier,
      options,
    );

    return this.#getFromPlanResult(planResult);
  }

  #resetComputedProperties(): void {
    this.#getBindingsPlanParams =
      this.#serviceReferenceManager.bindingService.get.bind(
        this.#serviceReferenceManager.bindingService,
      );
    this.#setBindingParamsPlan = this.#setBinding.bind(this);

    this.#resolutionContext = this.#buildResolutionContext();
  }

  #buildGetPlanOptions(
    isMultiple: boolean,
    serviceIdentifier: ServiceIdentifier,
    options: GetOptions | undefined,
  ): GetPlanOptions {
    return {
      isMultiple,
      name: options?.name,
      optional: options?.optional,
      serviceIdentifier,
      tag: options?.tag,
    };
  }

  #buildPlanParams(
    serviceIdentifier: ServiceIdentifier,
    isMultiple: boolean,
    options?: GetOptions,
  ): PlanParams {
    const planParams: PlanParams = {
      autobindOptions:
        (options?.autobind ?? this.#autobind)
          ? {
              scope: this.#defaultScope,
            }
          : undefined,
      getBindings: this.#getBindingsPlanParams,
      getClassMetadata,
      rootConstraints: {
        isMultiple,
        serviceIdentifier,
      },
      servicesBranch: [],
      setBinding: this.#setBindingParamsPlan,
    };

    this.#handlePlanParamsRootConstraints(planParams, options);

    return planParams;
  }

  #buildPlanResult(
    isMultiple: boolean,
    serviceIdentifier: ServiceIdentifier,
    options: GetOptions | undefined,
  ): PlanResult {
    const getPlanOptions: GetPlanOptions = this.#buildGetPlanOptions(
      isMultiple,
      serviceIdentifier,
      options,
    );

    const planResultFromCache: PlanResult | undefined =
      this.#serviceReferenceManager.planResultCacheService.get(getPlanOptions);

    if (planResultFromCache !== undefined) {
      return planResultFromCache;
    }

    const planResult: PlanResult = plan(
      this.#buildPlanParams(serviceIdentifier, isMultiple, options),
    );

    this.#serviceReferenceManager.planResultCacheService.set(
      getPlanOptions,
      planResult,
    );

    return planResult;
  }

  #buildResolutionContext(): ResolutionContext {
    return {
      get: this.get.bind(this),
      getAll: this.getAll.bind(this),
      getAllAsync: this.getAllAsync.bind(this),
      getAsync: this.getAsync.bind(this),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  #getFromPlanResult<T>(planResult: PlanResult): T {
    return resolve({
      context: this.#resolutionContext,
      getActivations: this.#getActivationsResolutionParam,
      planResult,
      requestScopeCache: new Map(),
    }) as T;
  }

  #handlePlanParamsRootConstraints(
    planParams: PlanParams,
    options: GetOptions | undefined,
  ): void {
    if (options === undefined) {
      return;
    }

    if (options.name !== undefined) {
      planParams.rootConstraints.name = options.name;
    }

    if (options.optional === true) {
      planParams.rootConstraints.isOptional = true;
    }

    if (options.tag !== undefined) {
      planParams.rootConstraints.tag = {
        key: options.tag.key,
        value: options.tag.value,
      };
    }
  }

  #setBinding(binding: Binding): void {
    this.#serviceReferenceManager.bindingService.set(binding);
    this.#serviceReferenceManager.planResultCacheService.clearCache();
  }
}
