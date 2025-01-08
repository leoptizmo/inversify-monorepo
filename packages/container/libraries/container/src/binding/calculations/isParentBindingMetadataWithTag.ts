import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';
import { isParentBindingMetadata } from './isParentBindingMetadata';

export function isParentBindingMetadataWithTag(
  tag: MetadataTag,
  value: unknown,
): (metadata: BindingMetadata) => boolean {
  return isParentBindingMetadata(isBindingMetadataWithTag(tag, value));
}
