import { BindingMetadata } from '@inversifyjs/core';

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';

export function isNoAncestorBindingMetadata(
  constraint: (metadata: BindingMetadata) => boolean,
): (metadata: BindingMetadata) => boolean {
  const isAnyAncestorBindingMetadataConstraint: (
    metadata: BindingMetadata,
  ) => boolean = isAnyAncestorBindingMetadata(constraint);

  return (metadata: BindingMetadata): boolean => {
    return !isAnyAncestorBindingMetadataConstraint(metadata);
  };
}
