import 'reflect-metadata';

import {
  BindInFluentSyntax,
  BindInWhenOnFluentSyntax,
  BindOnFluentSyntax,
  BindToFluentSyntax,
  BindWhenFluentSyntax,
  BindWhenOnFluentSyntax,
} from './binding/models/BindingFluentSyntax';
import {
  ContainerModule,
  ContainerModuleLoadOptions,
} from './container/models/ContainerModule';
import { IsBoundOptions } from './container/models/isBoundOptions';
import { Container, ContainerOptions } from './container/services/Container';
import { InversifyContainerError } from './error/models/InversifyContainerError';
import { InversifyContainerErrorKind } from './error/models/InversifyContainerErrorKind';

export type {
  BindInFluentSyntax,
  BindInWhenOnFluentSyntax,
  BindOnFluentSyntax,
  BindToFluentSyntax,
  BindWhenFluentSyntax,
  BindWhenOnFluentSyntax,
  ContainerModuleLoadOptions,
  ContainerOptions,
  IsBoundOptions,
};

export {
  Container,
  ContainerModule,
  InversifyContainerError,
  InversifyContainerErrorKind,
};
