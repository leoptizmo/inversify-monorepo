import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

import { isBindingMetadataWithRightParent } from './isBindingMetadataWithRightParent';
import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';

export function isParentBindingMetadataWithTag(
  tag: MetadataTag,
  value: unknown,
): (metadata: BindingMetadata) => boolean {
  return isBindingMetadataWithRightParent(isBindingMetadataWithTag(tag, value));
}
