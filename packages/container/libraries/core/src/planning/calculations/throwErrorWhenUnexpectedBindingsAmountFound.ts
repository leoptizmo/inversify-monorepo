import {
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from '@inversifyjs/common';

import { stringifyBinding } from '../../binding/calculations/stringifyBinding';
import { BindingConstraints } from '../../binding/models/BindingConstraints';
import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { MetadataTag } from '../../metadata/models/MetadataTag';
import { BindingNodeParent } from '../models/BindingNodeParent';
import { PlanBindingNode } from '../models/PlanBindingNode';
import { isPlanServiceRedirectionBindingNode } from './isPlanServiceRedirectionBindingNode';

export function throwErrorWhenUnexpectedBindingsAmountFound(
  bindings: PlanBindingNode[] | PlanBindingNode | undefined,
  isOptional: boolean,
  node: BindingNodeParent,
  bindingConstraints: BindingConstraints,
): void {
  let serviceIdentifier: ServiceIdentifier;
  let parentServiceIdentifier: ServiceIdentifier | undefined;

  if (isPlanServiceRedirectionBindingNode(node)) {
    serviceIdentifier = node.binding.targetServiceIdentifier;
    parentServiceIdentifier = node.binding.serviceIdentifier;
  } else {
    serviceIdentifier = node.serviceIdentifier;
    parentServiceIdentifier = node.parent?.binding.serviceIdentifier;
  }

  if (Array.isArray(bindings)) {
    throwErrorWhenMultipleUnexpectedBindingsAmountFound(
      bindings,
      isOptional,
      serviceIdentifier,
      parentServiceIdentifier,
      bindingConstraints,
    );
  } else {
    throwErrorWhenSingleUnexpectedBindingFound(
      bindings,
      isOptional,
      serviceIdentifier,
      parentServiceIdentifier,
      bindingConstraints,
    );
  }
}

function throwBindingNotFoundError(
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined,
  bindingConstraints: BindingConstraints,
): never {
  const errorMessage: string = `No bindings found for service: "${stringifyServiceIdentifier(serviceIdentifier)}".

Trying to resolve bindings for "${stringifyParentServiceIdentifier(serviceIdentifier, parentServiceIdentifier)}".

${stringifyBindingConstraints(bindingConstraints)}`;

  throw new InversifyCoreError(InversifyCoreErrorKind.planning, errorMessage);
}

function throwErrorWhenMultipleUnexpectedBindingsAmountFound(
  bindings: PlanBindingNode[],
  isOptional: boolean,
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined,
  bindingConstraints: BindingConstraints,
): void {
  if (bindings.length === 0) {
    if (!isOptional) {
      throwBindingNotFoundError(
        serviceIdentifier,
        parentServiceIdentifier,
        bindingConstraints,
      );
    }
  } else {
    const errorMessage: string = `Ambiguous bindings found for service: "${stringifyServiceIdentifier(serviceIdentifier)}".

Registered bindings:

${bindings.map((binding: PlanBindingNode): string => stringifyBinding(binding.binding)).join('\n')}

Trying to resolve bindings for "${stringifyParentServiceIdentifier(serviceIdentifier, parentServiceIdentifier)}".

${stringifyBindingConstraints(bindingConstraints)}`;

    throw new InversifyCoreError(InversifyCoreErrorKind.planning, errorMessage);
  }
}

function throwErrorWhenSingleUnexpectedBindingFound(
  bindings: PlanBindingNode | undefined,
  isOptional: boolean,
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined,
  bindingConstraints: BindingConstraints,
): void {
  if (bindings === undefined && !isOptional) {
    throwBindingNotFoundError(
      serviceIdentifier,
      parentServiceIdentifier,
      bindingConstraints,
    );
  } else {
    return;
  }
}

function stringifyParentServiceIdentifier(
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined,
): string {
  return parentServiceIdentifier === undefined
    ? `${stringifyServiceIdentifier(serviceIdentifier)} (Root service)`
    : stringifyServiceIdentifier(parentServiceIdentifier);
}

function stringifyBindingConstraints(
  bindingConstraints: BindingConstraints,
): string {
  const stringifiedTags: string =
    bindingConstraints.tags.size === 0
      ? ''
      : `
- tags:
  - ${[...bindingConstraints.tags.keys()].map((key: MetadataTag) => key.toString()).join('\n  - ')}`;

  return `Binding constraints:
- service identifier: ${stringifyServiceIdentifier(bindingConstraints.serviceIdentifier)}
- name: ${bindingConstraints.name?.toString() ?? '-'}${stringifiedTags}`;
}
