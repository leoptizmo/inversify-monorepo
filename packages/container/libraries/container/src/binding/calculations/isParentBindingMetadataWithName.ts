import { BindingMetadata, MetadataName } from '@inversifyjs/core';

import { isBindingMetadataWithName } from './isBindingMetadataWithName';
import { isParentBindingMetadata } from './isParentBindingMetadata';

export function isParentBindingMetadataWithName(
  name: MetadataName,
): (metadata: BindingMetadata) => boolean {
  return isParentBindingMetadata(isBindingMetadataWithName(name));
}
