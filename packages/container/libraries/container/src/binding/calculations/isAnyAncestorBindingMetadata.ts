import { BindingMetadata } from '@inversifyjs/core';

export function isAnyAncestorBindingMetadata(
  constraint: (metadata: BindingMetadata) => boolean,
): (metadata: BindingMetadata) => boolean {
  return (metadata: BindingMetadata): boolean => {
    for (
      let ancestorMetadata: BindingMetadata | undefined =
        metadata.getAncestor();
      ancestorMetadata !== undefined;
      ancestorMetadata = ancestorMetadata.getAncestor()
    ) {
      if (constraint(ancestorMetadata)) {
        return true;
      }
    }

    return false;
  };
}
