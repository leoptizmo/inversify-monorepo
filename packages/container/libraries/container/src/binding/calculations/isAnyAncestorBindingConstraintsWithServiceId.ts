import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingConstraints } from '@inversifyjs/core';

import { isAnyAncestorBindingConstraints } from './isAnyAncestorBindingConstraints';
import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';

export function isAnyAncestorBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return isAnyAncestorBindingConstraints(
    isBindingConstraintsWithServiceId(serviceId),
  );
}
