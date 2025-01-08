import { Newable, ServiceIdentifier } from '@inversifyjs/common';
import {
  BindingActivation,
  BindingDeactivation,
  BindingMetadata,
  DynamicValueBuilder,
  Factory,
  MetadataName,
  MetadataTag,
  Provider,
  ResolutionContext,
} from '@inversifyjs/core';

export interface BindToFluentSyntax<T> {
  to(type: Newable<T>): BindInWhenOnFluentSyntax<T>;
  toSelf(): BindInWhenOnFluentSyntax<T>;
  toConstantValue(value: T): BindWhenOnFluentSyntax<T>;
  toDynamicValue(builder: DynamicValueBuilder<T>): BindInWhenOnFluentSyntax<T>;
  toFactory(
    factory: T extends Factory<unknown>
      ? (context: ResolutionContext) => T
      : never,
  ): BindWhenOnFluentSyntax<T>;
  toProvider(
    provider: T extends Provider<unknown>
      ? (context: ResolutionContext) => T
      : never,
  ): BindWhenOnFluentSyntax<T>;
  toService(service: ServiceIdentifier<T>): void;
}

export interface BindInFluentSyntax<T> {
  inSingletonScope(): BindWhenOnFluentSyntax<T>;
  inTransientScope(): BindWhenOnFluentSyntax<T>;
  inRequestScope(): BindWhenOnFluentSyntax<T>;
}

export interface BindInWhenOnFluentSyntax<T>
  extends BindInFluentSyntax<T>,
    BindWhenOnFluentSyntax<T> {}

export interface BindOnFluentSyntax<T> {
  onActivation(activation: BindingActivation<T>): BindWhenFluentSyntax<T>;
  onDeactivation(deactivation: BindingDeactivation<T>): BindWhenFluentSyntax<T>;
}

export interface BindWhenOnFluentSyntax<T>
  extends BindWhenFluentSyntax<T>,
    BindOnFluentSyntax<T> {}

export interface BindWhenFluentSyntax<T> {
  when(
    constraint: (metadata: BindingMetadata) => boolean,
  ): BindOnFluentSyntax<T>;
  whenNamed(name: MetadataName): BindOnFluentSyntax<T>;
  whenParentNamed(name: MetadataName): BindOnFluentSyntax<T>;
  whenParentTagged(tag: MetadataTag, tagValue: unknown): BindOnFluentSyntax<T>;
  whenTagged(tag: MetadataTag, tagValue: unknown): BindOnFluentSyntax<T>;
}
