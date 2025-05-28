import { BindingConstraints, MetadataTag } from '@gritcode/inversifyjs-core';

import { isBindingConstraintsWithTag } from './isBindingConstraintsWithTag';
import { isParentBindingConstraints } from './isParentBindingConstraints';

export function isParentBindingConstraintsWithTag(
  tag: MetadataTag,
  value: unknown,
): (constraints: BindingConstraints) => boolean {
  return isParentBindingConstraints(isBindingConstraintsWithTag(tag, value));
}
