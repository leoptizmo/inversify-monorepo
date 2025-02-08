import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingConstraints } from '@inversifyjs/core';

import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';
import { isNotParentBindingConstraints } from './isNotParentBindingConstraints';

export function isNotParentBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return isNotParentBindingConstraints(
    isBindingConstraintsWithServiceId(serviceId),
  );
}
