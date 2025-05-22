import { BindingConstraints, MetadataName } from '@gritcode/inversifyjs-core';

import { isBindingConstraintsWithName } from './isBindingConstraintsWithName';
import { isNotParentBindingConstraints } from './isNotParentBindingConstraints';

export function isNotParentBindingConstraintsWithName(
  name: MetadataName,
): (constraints: BindingConstraints) => boolean {
  return isNotParentBindingConstraints(isBindingConstraintsWithName(name));
}
