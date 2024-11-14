/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import { Container, type interfaces } from 'inversify';

type IfAny<T, TYes, TNo> = 0 extends 1 & T ? TYes : TNo;

type BindingMapProperty = string | symbol;
type BindingMap = Record<BindingMapProperty, any>;
type MappedServiceIdentifier<T extends BindingMap> = IfAny<
  T,
  interfaces.ServiceIdentifier,
  keyof T
>;
type ContainerBinding<
  TBindingMap extends BindingMap,
  TKey extends MappedServiceIdentifier<TBindingMap> = any,
> = TKey extends keyof TBindingMap
  ? TBindingMap[TKey]
  : TKey extends interfaces.Newable<infer C>
    ? C
    : // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      TKey extends Function
      ? any
      : never;

type Synchronous<T extends BindingMap> = IfAny<
  T,
  any,
  { [K in keyof T as T[K] extends Promise<any> ? never : K]: T[K] }
>;

type First<T extends any[]> = T extends [infer TFirst, ...any[]]
  ? TFirst
  : never;

type AllButFirst<T extends any[]> = T extends [any, ...infer TRest]
  ? TRest
  : never;

interface ContainerOverrides<
  T extends BindingMap = any,
  TAncestors extends BindingMap[] = any[],
> {
  parent: ContainerOverrides<First<TAncestors>, AllButFirst<TAncestors>> | null;
  bind: Bind<T>;
  get: <
    TBound extends ContainerBinding<Synchronous<T>, TKey>,
    TKey extends MappedServiceIdentifier<Synchronous<T>> = any,
  >(
    serviceIdentifier: TKey,
  ) => TBound;
  getNamed: <
    TBound extends ContainerBinding<Synchronous<T>, TKey>,
    TKey extends MappedServiceIdentifier<Synchronous<T>> = any,
  >(
    serviceIdentifier: TKey,
    named: PropertyKey,
  ) => TBound;
  getTagged: <
    TBound extends ContainerBinding<Synchronous<T>, TKey>,
    TKey extends MappedServiceIdentifier<Synchronous<T>> = any,
  >(
    serviceIdentifier: TKey,
    key: PropertyKey,
    value: unknown,
  ) => TBound;
  getAll: <
    TBound extends ContainerBinding<Synchronous<T>, TKey>,
    TKey extends MappedServiceIdentifier<Synchronous<T>> = any,
  >(
    serviceIdentifier: TKey,
  ) => TBound[];
  getAllTagged: <
    TBound extends ContainerBinding<Synchronous<T>, TKey>,
    TKey extends MappedServiceIdentifier<Synchronous<T>> = any,
  >(
    serviceIdentifier: TKey,
    key: PropertyKey,
    value: unknown,
  ) => TBound[];
  getAllNamed: <
    TBound extends ContainerBinding<Synchronous<T>, TKey>,
    TKey extends MappedServiceIdentifier<Synchronous<T>> = any,
  >(
    serviceIdentifier: TKey,
    named: PropertyKey,
  ) => TBound[];
  getAsync: <
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
  ) => Promise<Awaited<TBound>>;
  getNamedAsync: <
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
    named: PropertyKey,
  ) => Promise<Awaited<TBound>>;
  getTaggedAsync: <
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
    key: PropertyKey,
    value: unknown,
  ) => Promise<Awaited<TBound>>;
  getAllAsync: <
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
  ) => Promise<Awaited<TBound>[]>;
  getAllTaggedAsync: <
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
    key: PropertyKey,
    value: unknown,
  ) => Promise<TBound[]>;
  getAllNamedAsync: <
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
    named: PropertyKey,
  ) => Promise<Awaited<TBound>[]>;
  isBound: IsBound<T>;
  isBoundNamed: (
    serviceIdentifier: MappedServiceIdentifier<T>,
    named: PropertyKey,
  ) => boolean;
  isBoundTagged: (
    serviceIdentifier: MappedServiceIdentifier<T>,
    key: PropertyKey,
    value: unknown,
  ) => boolean;
  isCurrentBound: IsBound<T>;
  rebind: Rebind<T>;
  rebindAsync: RebindAsync<T>;
  unbind: Unbind<T>;
  unbindAsync: UnbindAsync<T>;
  onActivation<
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
    onActivation: interfaces.BindingActivation<TBound>,
  ): void;
  onDeactivation<
    TBound extends ContainerBinding<T, TKey>,
    TKey extends MappedServiceIdentifier<T> = any,
  >(
    serviceIdentifier: TKey,
    onDeactivation: interfaces.BindingDeactivation<TBound>,
  ): void;
  resolve<TBound>(constructorFunction: interfaces.Newable<TBound>): TBound;
  createChild<TChild extends BindingMap = any>(
    containerOptions?: interfaces.ContainerOptions,
  ): TypedContainer<TChild & Omit<T, keyof TChild>, [T, ...TAncestors]>;
}

type Bind<T extends BindingMap = any> = <
  TBound extends ContainerBinding<T, TKey>,
  TKey extends MappedServiceIdentifier<T> = any,
>(
  serviceIdentifier: TKey,
) => interfaces.BindingToSyntax<TBound>;

type Rebind<T extends BindingMap = any> = Bind<T>;

type RebindAsync<T extends BindingMap = any> = <
  TBound extends ContainerBinding<T, TKey>,
  TKey extends MappedServiceIdentifier<T> = any,
>(
  serviceIdentifier: TKey,
) => Promise<interfaces.BindingToSyntax<TBound>>;

type Unbind<T extends BindingMap = any> = <
  TKey extends MappedServiceIdentifier<T>,
>(
  serviceIdentifier: TKey,
) => void;

type UnbindAsync<T extends BindingMap = any> = <
  TKey extends MappedServiceIdentifier<T>,
>(
  serviceIdentifier: TKey,
) => Promise<void>;

type IsBound<T extends BindingMap = any> = <
  TKey extends MappedServiceIdentifier<T>,
>(
  serviceIdentifier: TKey,
) => boolean;

export type TypedContainer<
  T extends BindingMap = any,
  TAncestors extends BindingMap[] = any[],
> = ContainerOverrides<T, TAncestors> &
  Omit<interfaces.Container, keyof ContainerOverrides>;

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-assignment
export const TypedContainer: {
  new <T extends BindingMap = any, TAncestors extends BindingMap[] = any[]>(
    ...args: ConstructorParameters<typeof Container>
  ): TypedContainer<T, TAncestors>;
} = Container as any;
