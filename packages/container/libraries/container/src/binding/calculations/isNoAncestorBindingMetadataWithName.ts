import { BindingMetadata, MetadataName } from '@inversifyjs/core';

import { isBindingMetadataWithName } from './isBindingMetadataWithName';
import { isNoAncestorBindingMetadata } from './isNoAncestorBindingMetadata';

export function isNoAncestorBindingMetadataWithName(
  name: MetadataName,
): (metadata: BindingMetadata) => boolean {
  return isNoAncestorBindingMetadata(isBindingMetadataWithName(name));
}
