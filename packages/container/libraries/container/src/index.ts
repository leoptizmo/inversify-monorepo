import 'reflect-metadata';

import {
  BindInFluentSyntax,
  BindInWhenOnFluentSyntax,
  BindOnFluentSyntax,
  BindToFluentSyntax,
  BindWhenFluentSyntax,
  BindWhenOnFluentSyntax,
  BoundServiceSyntax,
} from './binding/models/BindingFluentSyntax';
import { BindingIdentifier } from './binding/models/BindingIdentifier';
import {
  ResolvedValueInjectOptions,
  ResolvedValueMetadataInjectOptions,
  ResolvedValueMetadataInjectTagOptions,
} from './binding/models/ResolvedValueInjectOptions';
import {
  ContainerModule,
  ContainerModuleLoadOptions,
} from './container/models/ContainerModule';
import { ContainerOptions } from './container/models/ContainerOptions';
import { IsBoundOptions } from './container/models/isBoundOptions';
import { Container } from './container/services/Container';
import { InversifyContainerError } from './error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from './error/models/InversifyContainerErrorKind';

export type {
  BindingIdentifier,
  BindInFluentSyntax,
  BindInWhenOnFluentSyntax,
  BindOnFluentSyntax,
  BindToFluentSyntax,
  BindWhenFluentSyntax,
  BindWhenOnFluentSyntax,
  BoundServiceSyntax,
  ContainerModuleLoadOptions,
  ContainerOptions,
  IsBoundOptions,
  ResolvedValueInjectOptions,
  ResolvedValueMetadataInjectOptions,
  ResolvedValueMetadataInjectTagOptions,
};

export {
  Container,
  ContainerModule,
  InversifyContainerError,
  InversifyContainerErrorKind,
};
