import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingConstraints } from '@inversifyjs/core';

import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';
import { isParentBindingConstraints } from './isParentBindingConstraints';

export function isParentBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return isParentBindingConstraints(
    isBindingConstraintsWithServiceId(serviceId),
  );
}
