import { BindingConstraints, MetadataTag } from '@inversifyjs/core';

import { isBindingConstraintsWithTag } from './isBindingConstraintsWithTag';
import { isNotParentBindingConstraints } from './isNotParentBindingConstraints';

export function isNotParentBindingConstraintsWithTag(
  tag: MetadataTag,
  value: unknown,
): (constraints: BindingConstraints) => boolean {
  return isNotParentBindingConstraints(isBindingConstraintsWithTag(tag, value));
}
