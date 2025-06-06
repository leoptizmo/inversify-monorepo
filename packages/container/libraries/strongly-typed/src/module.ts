/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BindingActivation,
  BindingDeactivation,
  ContainerModule,
} from 'inversify';

import {
  Bind,
  BindingMap,
  ContainerBinding,
  IsBound,
  MappedServiceIdentifier,
  Rebind,
  RebindSync,
  Unbind,
  UnbindSync,
} from './container';

export interface TypedContainerModuleLoadOptions<T extends BindingMap = any> {
  readonly bind: Bind<T>;
  readonly isBound: IsBound<T>;
  readonly rebind: Rebind<T>;
  readonly rebindSync: RebindSync<T>;
  readonly unbind: Unbind<T>;
  readonly unbindSync: UnbindSync<T>;

  onActivation<
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
    onActivation: BindingActivation<TBound>,
  ): void;
  onDeactivation<
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
    onDeactivation: BindingDeactivation<TBound>,
  ): void;
}

export type TypedContainerModule<T extends BindingMap = any> = Omit<
  ContainerModule,
  'load'
> & {
  load(options: TypedContainerModuleLoadOptions<T>): void | Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment
export const TypedContainerModule: {
  new <T extends BindingMap = any>(
    load: (options: TypedContainerModuleLoadOptions<T>) => void | Promise<void>,
  ): TypedContainerModule<T>;
} = ContainerModule as any;
