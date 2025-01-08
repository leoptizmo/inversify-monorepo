import { BindingMetadata } from '@inversifyjs/core';

export function isBindingMetadataWithNoNameNorTags(
  metadata: BindingMetadata,
): boolean {
  return metadata.name === undefined && metadata.tags.size === 0;
}
