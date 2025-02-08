import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingConstraints } from '@inversifyjs/core';

import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';
import { isNoAncestorBindingConstraints } from './isNoAncestorBindingConstraints';

export function isNoAncestorBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return isNoAncestorBindingConstraints(
    isBindingConstraintsWithServiceId(serviceId),
  );
}
