import { BindingConstraints } from '@gritcode/inversifyjs-core';
import { ServiceIdentifier } from '@inversifyjs/common';

import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';
import { isParentBindingConstraints } from './isParentBindingConstraints';

export function isParentBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return isParentBindingConstraints(
    isBindingConstraintsWithServiceId(serviceId),
  );
}
