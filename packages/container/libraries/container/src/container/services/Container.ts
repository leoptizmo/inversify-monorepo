import {
  isPromise,
  Newable,
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from '@inversifyjs/common';
import {
  ActivationsService,
  Binding,
  BindingActivation,
  BindingDeactivation,
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
  ResolutionContext,
  resolve,
} from '@inversifyjs/core';
import {
  isPlugin,
  Plugin,
  PluginApi,
  PluginContext,
} from '@inversifyjs/plugin';

import { BindToFluentSyntax } from '../../binding/models/BindingFluentSyntax';
import { BindingIdentifier } from '../../binding/models/BindingIdentifier';
import { InversifyContainerError } from '../../error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from '../../error/models/InversifyContainerErrorKind';
import { ContainerModule } from '../models/ContainerModule';
import { IsBoundOptions } from '../models/isBoundOptions';
import { BindingManager } from './BindingManager';
import { ContainerModuleManager } from './ContainerModuleManager';
import { ServiceReferenceManager } from './ServiceReferenceManager';
import { SnapshotManager } from './SnapshotManager';

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
  readonly #bindingManager: BindingManager;
  readonly #containerModuleManager: ContainerModuleManager;
  readonly #getActivationsResolutionParam: <TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
  ) => Iterable<BindingActivation<TActivated>> | undefined;
  #getBindingsPlanParams: <TInstance>(
    serviceIdentifier: ServiceIdentifier<TInstance>,
  ) => Iterable<Binding<TInstance>> | undefined;
  readonly #options: InternalContainerOptions;
  readonly #pluginApi: PluginApi<Container>;
  readonly #pluginContext: PluginContext;
  #resolutionContext: ResolutionContext;
  readonly #serviceReferenceManager: ServiceReferenceManager;
  readonly #snapshotManager: SnapshotManager;
  #setBindingParamsPlan: <TInstance>(binding: Binding<TInstance>) => void;

  constructor(options?: ContainerOptions) {
    this.#getActivationsResolutionParam = <TActivated>(
      serviceIdentifier: ServiceIdentifier<TActivated>,
    ): Iterable<BindingActivation<TActivated>> | undefined =>
      this.#serviceReferenceManager.activationService.get(serviceIdentifier) as
        | Iterable<BindingActivation<TActivated>>
        | undefined;

    this.#pluginApi = this.#buildPluginApi();
    this.#pluginContext = this.#buildPluginContext();
    this.#resolutionContext = this.#buildResolutionContext();

    this.#serviceReferenceManager = this.#buildServiceReferenceManager(options);
    this.#serviceReferenceManager.onReset(
      this.#resetComputedProperties.bind(this),
    );

    this.#getBindingsPlanParams =
      this.#serviceReferenceManager.bindingService.get.bind(
        this.#serviceReferenceManager.bindingService,
      );
    this.#setBindingParamsPlan = this.#setBinding.bind(this);

    this.#options = {
      autobind: options?.autobind ?? false,
      defaultScope: options?.defaultScope ?? DEFAULT_DEFAULT_SCOPE,
    };

    const deactivationParams: DeactivationParams =
      this.#buildDeactivationParams();

    this.#bindingManager = new BindingManager(
      deactivationParams,
      this.#options.defaultScope,
      this.#serviceReferenceManager,
    );
    this.#containerModuleManager = new ContainerModuleManager(
      this.#bindingManager,
      deactivationParams,
      this.#options.defaultScope,
      this.#serviceReferenceManager,
    );
    this.#snapshotManager = new SnapshotManager(this.#serviceReferenceManager);
  }

  public bind<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): BindToFluentSyntax<T> {
    return this.#bindingManager.bind(serviceIdentifier);
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
    return this.#bindingManager.isBound(serviceIdentifier, options);
  }

  public isCurrentBound(
    serviceIdentifier: ServiceIdentifier,
    options?: IsBoundOptions,
  ): boolean {
    return this.#bindingManager.isCurrentBound(serviceIdentifier, options);
  }

  public async load(...modules: ContainerModule[]): Promise<void> {
    return this.#containerModuleManager.load(...modules);
  }

  public loadSync(...modules: ContainerModule[]): void {
    this.#containerModuleManager.loadSync(...modules);
  }

  public onActivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    activation: BindingActivation<T>,
  ): void {
    this.#serviceReferenceManager.activationService.add(
      activation as BindingActivation,
      {
        serviceId: serviceIdentifier,
      },
    );
  }

  public onDeactivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    deactivation: BindingDeactivation<T>,
  ): void {
    this.#serviceReferenceManager.deactivationService.add(
      deactivation as BindingDeactivation,
      {
        serviceId: serviceIdentifier,
      },
    );
  }

  public register(pluginConstructor: Newable): void {
    const pluginInstance: Partial<Plugin<Container>> = new pluginConstructor(
      this.#pluginContext,
    ) as Partial<Plugin<Container>>;

    if (pluginInstance[isPlugin] !== true) {
      throw new InversifyContainerError(
        InversifyContainerErrorKind.invalidOperation,
        'Invalid plugin. The plugin must extend the Plugin class',
      );
    }

    (pluginInstance as Plugin<Container>).load(this.#pluginApi);
  }

  public restore(): void {
    this.#snapshotManager.restore();
  }

  public async rebind<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): Promise<BindToFluentSyntax<T>> {
    return this.#bindingManager.rebind(serviceIdentifier);
  }

  public rebindSync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): BindToFluentSyntax<T> {
    return this.#bindingManager.rebindSync(serviceIdentifier);
  }

  public snapshot(): void {
    this.#snapshotManager.snapshot();
  }

  public async unbind(
    identifier: BindingIdentifier | ServiceIdentifier,
  ): Promise<void> {
    await this.#bindingManager.unbind(identifier);
  }

  public async unbindAll(): Promise<void> {
    return this.#bindingManager.unbindAll();
  }

  public unbindSync(identifier: BindingIdentifier | ServiceIdentifier): void {
    this.#bindingManager.unbindSync(identifier);
  }

  public async unload(...modules: ContainerModule[]): Promise<void> {
    return this.#containerModuleManager.unload(...modules);
  }

  public unloadSync(...modules: ContainerModule[]): void {
    this.#containerModuleManager.unloadSync(...modules);
  }

  #buildDeactivationParams(): DeactivationParams {
    return {
      getBindings: <TInstance>(
        serviceIdentifier: ServiceIdentifier<TInstance>,
      ): Iterable<Binding<TInstance>> | undefined =>
        this.#serviceReferenceManager.bindingService.get(serviceIdentifier),
      getBindingsFromModule: <TInstance>(
        moduleId: number,
      ): Iterable<Binding<TInstance>> | undefined =>
        this.#serviceReferenceManager.bindingService.getByModuleId(moduleId),
      getClassMetadata,
      getDeactivations: <TActivated>(
        serviceIdentifier: ServiceIdentifier<TActivated>,
      ) =>
        this.#serviceReferenceManager.deactivationService.get(
          serviceIdentifier,
        ),
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
    serviceIdentifier: ServiceIdentifier,
    isMultiple: boolean,
    options?: GetOptions,
  ): PlanParams {
    const planParams: PlanParams = {
      autobindOptions:
        (options?.autobind ?? this.#options.autobind)
          ? {
              scope: this.#options.defaultScope,
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

  #buildPluginApi(): PluginApi<Container> {
    return {
      define: (
        name: string | symbol,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        method: (this: Container, ...args: any[]) => unknown,
      ): void => {
        if (Object.prototype.hasOwnProperty.call(this, name)) {
          throw new InversifyContainerError(
            InversifyContainerErrorKind.invalidOperation,
            `Container already has a method named "${String(name)}"`,
          );
        }

        (this as Record<string | symbol, unknown>)[name] = method.bind(this);
      },
    };
  }

  #buildPluginContext(): PluginContext {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self: Container = this;

    return {
      get activationService() {
        return self.#serviceReferenceManager.activationService;
      },
      get bindingService() {
        return self.#serviceReferenceManager.bindingService;
      },
      get deactivationService() {
        return self.#serviceReferenceManager.deactivationService;
      },
      get planResultCacheService() {
        return self.#serviceReferenceManager.planResultCacheService;
      },
    };
  }

  #buildResolutionContext(): ResolutionContext {
    return {
      get: this.get.bind(this),
      getAll: this.getAll.bind(this),
      getAllAsync: this.getAllAsync.bind(this),
      getAsync: this.getAsync.bind(this),
    };
  }

  #buildServiceReferenceManager(
    options?: ContainerOptions,
  ): ServiceReferenceManager {
    if (options?.parent === undefined) {
      return new ServiceReferenceManager(
        ActivationsService.build(undefined),
        BindingService.build(undefined),
        DeactivationsService.build(undefined),
        new PlanResultCacheService(),
      );
    }

    const planResultCacheService: PlanResultCacheService =
      new PlanResultCacheService();

    options.parent.#serviceReferenceManager.planResultCacheService.subscribe(
      planResultCacheService,
    );

    return new ServiceReferenceManager(
      ActivationsService.build(
        options.parent.#serviceReferenceManager.activationService,
      ),
      BindingService.build(
        options.parent.#serviceReferenceManager.bindingService,
      ),
      DeactivationsService.build(
        options.parent.#serviceReferenceManager.deactivationService,
      ),
      planResultCacheService,
    );
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

  #resetComputedProperties(): void {
    this.#getBindingsPlanParams =
      this.#serviceReferenceManager.bindingService.get.bind(
        this.#serviceReferenceManager.bindingService,
      );
    this.#resolutionContext = this.#buildResolutionContext();
    this.#setBindingParamsPlan = this.#setBinding.bind(this);
  }

  #setBinding(binding: Binding): void {
    this.#serviceReferenceManager.bindingService.set(binding);

    this.#serviceReferenceManager.planResultCacheService.clearCache();
  }
}
