import { BindingConstraints, MetadataName } from '@inversifyjs/core';

import { isBindingConstraintsWithName } from './isBindingConstraintsWithName';
import { isNoAncestorBindingConstraints } from './isNoAncestorBindingConstraints';

export function isNoAncestorBindingConstraintsWithName(
  name: MetadataName,
): (constraints: BindingConstraints) => boolean {
  return isNoAncestorBindingConstraints(isBindingConstraintsWithName(name));
}
