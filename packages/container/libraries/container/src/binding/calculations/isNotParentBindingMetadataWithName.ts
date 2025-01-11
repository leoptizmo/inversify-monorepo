import { BindingMetadata, MetadataName } from '@inversifyjs/core';

import { isBindingMetadataWithName } from './isBindingMetadataWithName';
import { isNotParentBindingMetadata } from './isNotParentBindingMetadata';

export function isNotParentBindingMetadataWithName(
  name: MetadataName,
): (metadata: BindingMetadata) => boolean {
  return isNotParentBindingMetadata(isBindingMetadataWithName(name));
}
