import { BindingConstraints } from '@gritcode/inversifyjs-core';
import { ServiceIdentifier } from '@inversifyjs/common';

import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';
import { isNoAncestorBindingConstraints } from './isNoAncestorBindingConstraints';

export function isNoAncestorBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return isNoAncestorBindingConstraints(
    isBindingConstraintsWithServiceId(serviceId),
  );
}
