import { Newable, ServiceIdentifier } from '@inversifyjs/common';
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
  OptionalGetOptions,
  PlanResultCacheService,
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
import { ServiceResolutionManager } from './ServiceResolutionManager';
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
  readonly #options: InternalContainerOptions;
  readonly #pluginApi: PluginApi<Container>;
  readonly #pluginContext: PluginContext;
  readonly #serviceReferenceManager: ServiceReferenceManager;
  readonly #serviceResolutionManager: ServiceResolutionManager;
  readonly #snapshotManager: SnapshotManager;

  constructor(options?: ContainerOptions) {
    this.#pluginApi = this.#buildPluginApi();
    this.#pluginContext = this.#buildPluginContext();

    this.#serviceReferenceManager = this.#buildServiceReferenceManager(options);

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
    this.#serviceResolutionManager = new ServiceResolutionManager(
      this.#serviceReferenceManager,
      this.#options.autobind,
      this.#options.defaultScope,
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
    return this.#serviceResolutionManager.get(serviceIdentifier, options);
  }

  public getAll<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options?: GetOptions,
  ): T[] {
    return this.#serviceResolutionManager.getAll(serviceIdentifier, options);
  }

  public async getAllAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    options?: GetOptions,
  ): Promise<T[]> {
    return this.#serviceResolutionManager.getAllAsync(
      serviceIdentifier,
      options,
    );
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
    return this.#serviceResolutionManager.getAsync(serviceIdentifier, options);
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
}
