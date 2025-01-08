import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingMetadata } from '@inversifyjs/core';

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';
import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';

export function isAnyAncestorBindingMetadataWithServiceId(
  serviceId: ServiceIdentifier,
): (metadata: BindingMetadata) => boolean {
  return isAnyAncestorBindingMetadata(
    isBindingMetadataWithServiceId(serviceId),
  );
}
