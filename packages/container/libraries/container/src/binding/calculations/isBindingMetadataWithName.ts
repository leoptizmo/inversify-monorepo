import { BindingMetadata, MetadataName } from '@inversifyjs/core';

export function isBindingMetadataWithName(
  name: MetadataName,
): (metadata: BindingMetadata) => boolean {
  return (metadata: BindingMetadata): boolean => metadata.name === name;
}
