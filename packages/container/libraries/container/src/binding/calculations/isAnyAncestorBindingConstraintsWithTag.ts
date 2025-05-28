import { BindingConstraints, MetadataTag } from '@gritcode/inversifyjs-core';

import { isAnyAncestorBindingConstraints } from './isAnyAncestorBindingConstraints';
import { isBindingConstraintsWithTag } from './isBindingConstraintsWithTag';

export function isAnyAncestorBindingConstraintsWithTag(
  tag: MetadataTag,
  value: unknown,
): (constraints: BindingConstraints) => boolean {
  return isAnyAncestorBindingConstraints(
    isBindingConstraintsWithTag(tag, value),
  );
}
