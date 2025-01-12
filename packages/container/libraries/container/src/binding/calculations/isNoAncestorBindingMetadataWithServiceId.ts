import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingMetadata } from '@inversifyjs/core';

import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';
import { isNoAncestorBindingMetadata } from './isNoAncestorBindingMetadata';

export function isNoAncestorBindingMetadataWithServiceId(
  serviceId: ServiceIdentifier,
): (metadata: BindingMetadata) => boolean {
  return isNoAncestorBindingMetadata(isBindingMetadataWithServiceId(serviceId));
}
