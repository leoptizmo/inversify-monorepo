import {
  isPromise,
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from '@inversifyjs/common';
import {
  ActivationsService,
  Binding,
  BindingActivation,
  BindingDeactivation,
  BindingMetadata,
  BindingScope,
  bindingScopeValues,
  BindingService,
  DeactivationParams,
  DeactivationsService,
  getClassMetadata,
  GetOptions,
  GetPlanOptions,
  OptionalGetOptions,
  plan,
  PlanParams,
  PlanResult,
  PlanResultCacheService,
  resolve,
  resolveModuleDeactivations,
  resolveServiceDeactivations,
} from '@inversifyjs/core';

import { BindToFluentSyntax } from '../../binding/models/BindingFluentSyntax';
import { BindToFluentSyntaxImplementation } from '../../binding/models/BindingFluentSyntaxImplementation';
import { InversifyContainerError } from '../../error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from '../../error/models/InversifyContainerErrorKind';
import { Snapshot } from '../../snapshot/models/Snapshot';
import {
  ContainerModule,
  ContainerModuleLoadOptions,
} from '../models/ContainerModule';
import { IsBoundOptions } from '../models/isBoundOptions';

export interface ContainerOptions {
  autobind?: true;
  defaultScope?: BindingScope | undefined;
  parent?: Container | undefined;
}

interface InternalContainerOptions {
  autobind: boolean;
  defaultScope: BindingScope;
}

const DEFAULT_DEFAULT_SCOPE: BindingScope = bindingScopeValues.Transient;

export class Container {
  #activationService: ActivationsService;
  #bindingService: BindingService;
  #deactivationService: DeactivationsService;
  readonly #options: InternalContainerOptions;
  readonly #planResultCacheService: PlanResultCacheService;
  readonly #snapshots: Snapshot[];

  constructor(options?: ContainerOptions) {
    this.#planResultCacheService = new PlanResultCacheService();

    if (options?.parent === undefined) {
      this.#activationService = ActivationsService.build(undefined);
      this.#bindingService = BindingService.build(undefined);
      this.#deactivationService = DeactivationsService.build(undefined);
    } else {
      this.#activationService = ActivationsService.build(
        options.parent.#activationService,
      );
      this.#bindingService = BindingService.build(
        options.parent.#bindingService,
      );
      this.#deactivationService = DeactivationsService.build(
        options.parent.#deactivationService,
      );

      options.parent.#planResultCacheService.subscribe(
        this.#planResultCacheService,
      );
    }

    this.#options = {
      autobind: options?.autobind ?? false,
      defaultScope: options?.defaultScope ?? DEFAULT_DEFAULT_SCOPE,
    };
    this.#snapshots = [];
  }

  public bind<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): BindToFluentSyntax<T> {
    return new BindToFluentSyntaxImplementation(
      (binding: Binding): void => {
        this.#setBinding(binding);
      },
      undefined,
      this.#options.defaultScope,
      serviceIdentifier,
    );
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
        `Unexpected asyncronous service when resolving service "${stringifyServiceIdentifier(serviceIdentifier)}"`,
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
        `Unexpected asyncronous service when resolving service "${stringifyServiceIdentifier(serviceIdentifier)}"`,
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

  public isBound(
    serviceIdentifier: ServiceIdentifier,
    options?: IsBoundOptions,
  ): boolean {
    const bindings: Iterable<Binding<unknown>> | undefined =
      this.#bindingService.get(serviceIdentifier);

    return this.#isAnyValidBinding(serviceIdentifier, bindings, options);
  }

  public isCurrentBound(
    serviceIdentifier: ServiceIdentifier,
    options?: IsBoundOptions,
  ): boolean {
    const bindings: Iterable<Binding<unknown>> | undefined =
      this.#bindingService.getNonParentBindings(serviceIdentifier);

    return this.#isAnyValidBinding(serviceIdentifier, bindings, options);
  }

  public async load(...modules: ContainerModule[]): Promise<void> {
    await Promise.all(
      modules.map(
        async (module: ContainerModule): Promise<void> =>
          module.load(this.#buildContainerModuleLoadOptions(module.id)),
      ),
    );
  }

  public onActivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    activation: BindingActivation<T>,
  ): void {
    this.#activationService.add(activation as BindingActivation, {
      serviceId: serviceIdentifier,
    });
  }

  public onDeactivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    deactivation: BindingDeactivation<T>,
  ): void {
    this.#deactivationService.add(deactivation as BindingDeactivation, {
      serviceId: serviceIdentifier,
    });
  }

  public restore(): void {
    const snapshot: Snapshot | undefined = this.#snapshots.pop();

    if (snapshot === undefined) {
      throw new InversifyContainerError(
        InversifyContainerErrorKind.invalidOperation,
        'No snapshot available to restore',
      );
    }

    this.#activationService = snapshot.activationService;
    this.#bindingService = snapshot.bindingService;
    this.#deactivationService = snapshot.deactivationService;

    this.#planResultCacheService.clearCache();
  }

  public snapshot(): void {
    this.#snapshots.push({
      activationService: this.#activationService.clone(),
      bindingService: this.#bindingService.clone(),
      deactivationService: this.#deactivationService.clone(),
    });
  }

  public async unbind(serviceIdentifier: ServiceIdentifier): Promise<void> {
    await resolveServiceDeactivations(
      this.#buildDeactivationParams(),
      serviceIdentifier,
    );

    this.#activationService.removeAllByServiceId(serviceIdentifier);
    this.#bindingService.removeAllByServiceId(serviceIdentifier);
    this.#deactivationService.removeAllByServiceId(serviceIdentifier);

    this.#planResultCacheService.clearCache();
  }

  public async unbindAll(): Promise<void> {
    const deactivationParams: DeactivationParams =
      this.#buildDeactivationParams();

    const nonParentBoundServiceIds: ServiceIdentifier[] = [
      ...this.#bindingService.getNonParentBoundServices(),
    ];

    await Promise.all(
      nonParentBoundServiceIds.map(
        async (serviceId: ServiceIdentifier): Promise<void> =>
          resolveServiceDeactivations(deactivationParams, serviceId),
      ),
    );

    /*
     * Removing service related objects here so unload is deterministic.
     *
     * Removing service related objects as soon as resolveModuleDeactivations takes
     * effect leads to module deactivations not triggering previously deleted
     * deactivations, introducing non determinism depending in the order in which
     * services are deactivated.
     */
    for (const serviceId of nonParentBoundServiceIds) {
      this.#activationService.removeAllByServiceId(serviceId);
      this.#bindingService.removeAllByServiceId(serviceId);
      this.#deactivationService.removeAllByServiceId(serviceId);
    }

    this.#planResultCacheService.clearCache();
  }

  public async unload(...modules: ContainerModule[]): Promise<void> {
    const deactivationParams: DeactivationParams =
      this.#buildDeactivationParams();

    await Promise.all(
      modules.map((module: ContainerModule): void | Promise<void> =>
        resolveModuleDeactivations(deactivationParams, module.id),
      ),
    );

    /*
     * Removing module related objects here so unload is deterministic.
     *
     * Removing modules as soon as resolveModuleDeactivations takes effect leads to
     * module deactivations not triggering previously deleted deactivations,
     * introducing non determinism depending in the order in which modules are
     * deactivated.
     */
    for (const module of modules) {
      this.#activationService.removeAllByModuleId(module.id);
      this.#bindingService.removeAllByModuleId(module.id);
      this.#deactivationService.removeAllByModuleId(module.id);
    }

    this.#planResultCacheService.clearCache();
  }

  #buildContainerModuleLoadOptions(
    moduleId: number,
  ): ContainerModuleLoadOptions {
    return {
      bind: <T>(
        serviceIdentifier: ServiceIdentifier<T>,
      ): BindToFluentSyntax<T> => {
        return new BindToFluentSyntaxImplementation(
          (binding: Binding): void => {
            this.#setBinding(binding);
          },
          moduleId,
          this.#options.defaultScope,
          serviceIdentifier,
        );
      },
      isBound: this.isBound.bind(this),
      onActivation: <T>(
        serviceIdentifier: ServiceIdentifier<T>,
        activation: BindingActivation<T>,
      ): void => {
        this.#activationService.add(activation as BindingActivation, {
          moduleId,
          serviceId: serviceIdentifier,
        });
      },
      onDeactivation: <T>(
        serviceIdentifier: ServiceIdentifier<T>,
        deactivation: BindingDeactivation<T>,
      ): void => {
        this.#deactivationService.add(deactivation as BindingDeactivation, {
          moduleId,
          serviceId: serviceIdentifier,
        });
      },
      unbind: this.unbind.bind(this),
    };
  }

  #buildDeactivationParams(): DeactivationParams {
    return {
      getBindings: <TInstance>(
        serviceIdentifier: ServiceIdentifier<TInstance>,
      ): Iterable<Binding<TInstance>> | undefined =>
        this.#bindingService.get(serviceIdentifier),
      getBindingsFromModule: <TInstance>(
        moduleId: number,
      ): Iterable<Binding<TInstance>> | undefined =>
        this.#bindingService.getByModuleId(moduleId),
      getClassMetadata,
      getDeactivations: <TActivated>(
        serviceIdentifier: ServiceIdentifier<TActivated>,
      ) => this.#deactivationService.get(serviceIdentifier),
    };
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
    isMultiple: boolean,
    serviceIdentifier: ServiceIdentifier,
    options: GetOptions | undefined,
  ): PlanParams {
    const planParams: PlanParams = {
      autobindOptions:
        (options?.autobind ?? this.#options.autobind)
          ? {
              scope: this.#options.defaultScope,
            }
          : undefined,
      getBindings: this.#bindingService.get.bind(this.#bindingService),
      getClassMetadata,
      rootConstraints: {
        isMultiple,
        serviceIdentifier,
      },
      servicesBranch: new Set(),
      setBinding: this.#setBinding.bind(this),
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
      this.#planResultCacheService.get(getPlanOptions);

    if (planResultFromCache !== undefined) {
      return planResultFromCache;
    }

    const planResult: PlanResult = plan(
      this.#buildPlanParams(isMultiple, serviceIdentifier, options),
    );

    this.#planResultCacheService.set(getPlanOptions, planResult);

    return planResult;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  #getFromPlanResult<T>(planResult: PlanResult): T {
    return resolve({
      context: {
        get: this.get.bind(this),
        getAll: this.getAll.bind(this),
        getAllAsync: this.getAllAsync.bind(this),
        getAsync: this.getAsync.bind(this),
      },
      getActivations: <TActivated>(
        serviceIdentifier: ServiceIdentifier<TActivated>,
      ): BindingActivation<TActivated>[] | undefined =>
        this.#activationService.get(serviceIdentifier) as
          | BindingActivation<TActivated>[]
          | undefined,
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

  #isAnyValidBinding(
    serviceIdentifier: ServiceIdentifier,
    bindings: Iterable<Binding<unknown>> | undefined,
    options?: IsBoundOptions,
  ): boolean {
    if (bindings === undefined) {
      return false;
    }

    const bindingMetadata: BindingMetadata = {
      getAncestor: () => undefined,
      name: options?.name,
      serviceIdentifier,
      tags: new Map(),
    };

    if (options?.tag !== undefined) {
      bindingMetadata.tags.set(options.tag.key, options.tag.value);
    }

    for (const binding of bindings) {
      if (binding.isSatisfiedBy(bindingMetadata)) {
        return true;
      }
    }

    return false;
  }

  #setBinding(binding: Binding): void {
    this.#bindingService.set(binding);

    this.#planResultCacheService.clearCache();
  }
}
