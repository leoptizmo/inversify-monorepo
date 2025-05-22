import { BindingConstraints } from '@gritcode/inversifyjs-core';
import { ServiceIdentifier } from '@inversifyjs/common';

import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';
import { isNotParentBindingConstraints } from './isNotParentBindingConstraints';

export function isNotParentBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return isNotParentBindingConstraints(
    isBindingConstraintsWithServiceId(serviceId),
  );
}
