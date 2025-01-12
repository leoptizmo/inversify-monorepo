import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';
import { isNoAncestorBindingMetadata } from './isNoAncestorBindingMetadata';

export function isNoAncestorBindingMetadataWithTag(
  tag: MetadataTag,
  value: unknown,
): (metadata: BindingMetadata) => boolean {
  return isNoAncestorBindingMetadata(isBindingMetadataWithTag(tag, value));
}
