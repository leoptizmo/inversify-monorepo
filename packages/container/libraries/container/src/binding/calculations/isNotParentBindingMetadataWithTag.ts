import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';
import { isNotParentBindingMetadata } from './isNotParentBindingMetadata';

export function isNotParentBindingMetadataWithTag(
  tag: MetadataTag,
  value: unknown,
): (metadata: BindingMetadata) => boolean {
  return isNotParentBindingMetadata(isBindingMetadataWithTag(tag, value));
}
