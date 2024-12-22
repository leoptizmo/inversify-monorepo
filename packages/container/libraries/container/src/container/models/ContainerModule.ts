import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingActivation, BindingDeactivation } from '@inversifyjs/core';

import { BindToFluentSyntax } from '../../binding/models/BindingFluentSyntax';
import { getContainerModuleId } from '../actions/getContainerModuleId';
import { IsBoundOptions } from './isBoundOptions';

export interface ContainerModuleLoadOptions {
  bind<T>(serviceIdentifier: ServiceIdentifier<T>): BindToFluentSyntax<T>;
  isBound(
    serviceIdentifier: ServiceIdentifier,
    options?: IsBoundOptions,
  ): boolean;
  onActivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    activation: BindingActivation<T>,
  ): void;
  onDeactivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    deactivation: BindingDeactivation<T>,
  ): void;
  unbind(serviceIdentifier: ServiceIdentifier): Promise<void>;
}

export class ContainerModule {
  readonly #id: number;
  readonly #load: (options: ContainerModuleLoadOptions) => Promise<void>;

  constructor(load: (options: ContainerModuleLoadOptions) => Promise<void>) {
    this.#id = getContainerModuleId();
    this.#load = load;
  }

  public get id(): number {
    return this.#id;
  }

  public get load(): (options: ContainerModuleLoadOptions) => Promise<void> {
    return this.#load;
  }
}
