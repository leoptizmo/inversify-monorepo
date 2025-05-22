import { BindingConstraints, MetadataName } from '@gritcode/inversifyjs-core';

import { isAnyAncestorBindingConstraints } from './isAnyAncestorBindingConstraints';
import { isBindingConstraintsWithName } from './isBindingConstraintsWithName';

export function isAnyAncestorBindingConstraintsWithName(
  name: MetadataName,
): (constraints: BindingConstraints) => boolean {
  return isAnyAncestorBindingConstraints(isBindingConstraintsWithName(name));
}
