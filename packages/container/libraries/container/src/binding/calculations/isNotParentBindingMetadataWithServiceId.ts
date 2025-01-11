import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingMetadata } from '@inversifyjs/core';

import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';
import { isNotParentBindingMetadata } from './isNotParentBindingMetadata';

export function isNotParentBindingMetadataWithServiceId(
  serviceId: ServiceIdentifier,
): (metadata: BindingMetadata) => boolean {
  return isNotParentBindingMetadata(isBindingMetadataWithServiceId(serviceId));
}
