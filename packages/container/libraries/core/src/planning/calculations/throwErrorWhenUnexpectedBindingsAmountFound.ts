import {
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from '@inversifyjs/common';

import { stringifyBinding } from '../../binding/calculations/stringifyBinding';
import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { BindingNodeParent } from '../models/BindingNodeParent';
import { PlanBindingNode } from '../models/PlanBindingNode';
import { isPlanServiceRedirectionBindingNode } from './isPlanServiceRedirectionBindingNode';

export function throwErrorWhenUnexpectedBindingsAmountFound(
  bindings: PlanBindingNode[],
  isOptional: boolean,
  node: BindingNodeParent,
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

  if (bindings.length === 0) {
    if (!isOptional) {
      const stringifiedParentServiceIdentifier: string =
        parentServiceIdentifier === undefined
          ? `${stringifyServiceIdentifier(serviceIdentifier)} (Root service)`
          : stringifyServiceIdentifier(parentServiceIdentifier);

      const errorMessage: string = `No bindings found for service: "${stringifyServiceIdentifier(serviceIdentifier)}".

Trying to resolve bindings for "${stringifiedParentServiceIdentifier}".`;

      throw new InversifyCoreError(
        InversifyCoreErrorKind.planning,
        errorMessage,
      );
    }
  } else {
    const stringifiedParentServiceIdentifier: string =
      parentServiceIdentifier === undefined
        ? `${stringifyServiceIdentifier(serviceIdentifier)} (Root service)`
        : stringifyServiceIdentifier(parentServiceIdentifier);

    const errorMessage: string = `Ambiguous bindings found for service: "${stringifyServiceIdentifier(serviceIdentifier)}".

Registered bindings:

${bindings.map((binding: PlanBindingNode): string => stringifyBinding(binding.binding)).join('\n')}

Trying to resolve bindings for "${stringifiedParentServiceIdentifier}".`;

    throw new InversifyCoreError(InversifyCoreErrorKind.planning, errorMessage);
  }
}
