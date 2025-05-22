import { BindingConstraints } from '@gritcode/inversifyjs-core';
import { ServiceIdentifier } from '@inversifyjs/common';

import { isAnyAncestorBindingConstraints } from './isAnyAncestorBindingConstraints';
import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';

export function isAnyAncestorBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return isAnyAncestorBindingConstraints(
    isBindingConstraintsWithServiceId(serviceId),
  );
}
