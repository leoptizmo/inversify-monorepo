import { BindingConstraints, MetadataName } from '@gritcode/inversifyjs-core';

import { isBindingConstraintsWithName } from './isBindingConstraintsWithName';
import { isParentBindingConstraints } from './isParentBindingConstraints';

export function isParentBindingConstraintsWithName(
  name: MetadataName,
): (constraints: BindingConstraints) => boolean {
  return isParentBindingConstraints(isBindingConstraintsWithName(name));
}
