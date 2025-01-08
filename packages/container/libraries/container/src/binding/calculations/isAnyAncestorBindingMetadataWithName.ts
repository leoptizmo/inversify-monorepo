import { BindingMetadata, MetadataName } from '@inversifyjs/core';

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';
import { isBindingMetadataWithName } from './isBindingMetadataWithName';

export function isAnyAncestorBindingMetadataWithName(
  name: MetadataName,
): (metadata: BindingMetadata) => boolean {
  return isAnyAncestorBindingMetadata(isBindingMetadataWithName(name));
}
