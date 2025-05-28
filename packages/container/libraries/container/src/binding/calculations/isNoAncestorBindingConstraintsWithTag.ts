import { BindingConstraints, MetadataTag } from '@gritcode/inversifyjs-core';

import { isBindingConstraintsWithTag } from './isBindingConstraintsWithTag';
import { isNoAncestorBindingConstraints } from './isNoAncestorBindingConstraints';

export function isNoAncestorBindingConstraintsWithTag(
  tag: MetadataTag,
  value: unknown,
): (constraints: BindingConstraints) => boolean {
  return isNoAncestorBindingConstraints(
    isBindingConstraintsWithTag(tag, value),
  );
}
