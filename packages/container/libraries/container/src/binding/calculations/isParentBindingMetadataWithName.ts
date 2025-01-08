import { BindingMetadata, MetadataName } from '@inversifyjs/core';

import { isBindingMetadataWithName } from './isBindingMetadataWithName';
import { isBindingMetadataWithRightParent } from './isBindingMetadataWithRightParent';

export function isParentBindingMetadataWithName(
  name: MetadataName,
): (metadata: BindingMetadata) => boolean {
  return isBindingMetadataWithRightParent(isBindingMetadataWithName(name));
}
