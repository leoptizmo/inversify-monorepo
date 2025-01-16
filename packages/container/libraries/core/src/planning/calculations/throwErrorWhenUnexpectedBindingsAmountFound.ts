import {
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from '@inversifyjs/common';

import { stringifyBinding } from '../../binding/calculations/stringifyBinding';
import { BindingMetadata } from '../../binding/models/BindingMetadata';
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
  bindingMetadata: BindingMetadata,
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
      bindingMetadata,
    );
  } else {
    throwErrorWhenSingleUnexpectedBindingFound(
      bindings,
      isOptional,
      serviceIdentifier,
      parentServiceIdentifier,
      bindingMetadata,
    );
  }
}

function throwBindingNotFoundError(
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined,
  bindingMetadata: BindingMetadata,
): never {
  const errorMessage: string = `No bindings found for service: "${stringifyServiceIdentifier(serviceIdentifier)}".

Trying to resolve bindings for "${stringifyParentServiceIdentifier(serviceIdentifier, parentServiceIdentifier)}".

${stringifyBindingMetadata(bindingMetadata)}`;

  throw new InversifyCoreError(InversifyCoreErrorKind.planning, errorMessage);
}

function throwErrorWhenMultipleUnexpectedBindingsAmountFound(
  bindings: PlanBindingNode[],
  isOptional: boolean,
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined,
  bindingMetadata: BindingMetadata,
): void {
  if (bindings.length === 0) {
    if (!isOptional) {
      throwBindingNotFoundError(
        serviceIdentifier,
        parentServiceIdentifier,
        bindingMetadata,
      );
    }
  } else {
    const errorMessage: string = `Ambiguous bindings found for service: "${stringifyServiceIdentifier(serviceIdentifier)}".

Registered bindings:

${bindings.map((binding: PlanBindingNode): string => stringifyBinding(binding.binding)).join('\n')}

Trying to resolve bindings for "${stringifyParentServiceIdentifier(serviceIdentifier, parentServiceIdentifier)}".

${stringifyBindingMetadata(bindingMetadata)}`;

    throw new InversifyCoreError(InversifyCoreErrorKind.planning, errorMessage);
  }
}

function throwErrorWhenSingleUnexpectedBindingFound(
  bindings: PlanBindingNode | undefined,
  isOptional: boolean,
  serviceIdentifier: ServiceIdentifier,
  parentServiceIdentifier: ServiceIdentifier | undefined,
  bindingMetadata: BindingMetadata,
): void {
  if (bindings === undefined && !isOptional) {
    throwBindingNotFoundError(
      serviceIdentifier,
      parentServiceIdentifier,
      bindingMetadata,
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

function stringifyBindingMetadata(bindingMetadata: BindingMetadata): string {
  const stringifiedTags: string =
    bindingMetadata.tags.size === 0
      ? ''
      : `
- tags:
  - ${[...bindingMetadata.tags.keys()].map((key: MetadataTag) => key.toString()).join('\n  - ')}`;

  return `Binding metadata:
- service identifier: ${stringifyServiceIdentifier(bindingMetadata.serviceIdentifier)}
- name: ${bindingMetadata.name?.toString() ?? '-'}${stringifiedTags}`;
}
