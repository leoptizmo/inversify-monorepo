import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';
import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';

export function isAnyAncestorBindingMetadataWithTag(
  tag: MetadataTag,
  value: unknown,
): (metadata: BindingMetadata) => boolean {
  return isAnyAncestorBindingMetadata(isBindingMetadataWithTag(tag, value));
}
