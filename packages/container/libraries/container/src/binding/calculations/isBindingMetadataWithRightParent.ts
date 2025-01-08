import { BindingMetadata } from '@inversifyjs/core';

export function isBindingMetadataWithRightParent(
  constraint: (metadata: BindingMetadata) => boolean,
): (metadata: BindingMetadata) => boolean {
  return (metadata: BindingMetadata): boolean => {
    const ancestorMetadata: BindingMetadata | undefined =
      metadata.getAncestor();

    return ancestorMetadata !== undefined && constraint(ancestorMetadata);
  };
}
