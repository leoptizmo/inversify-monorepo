import { BindingMetadata, MetadataTag } from '@inversifyjs/core';

export function isBindingMetadataWithTag(
  tag: MetadataTag,
  value: unknown,
): (metadata: BindingMetadata) => boolean {
  return (metadata: BindingMetadata): boolean =>
    metadata.tags.has(tag) && metadata.tags.get(tag) === value;
}
