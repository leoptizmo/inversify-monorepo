import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingMetadata } from '@inversifyjs/core';

import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';
import { isParentBindingMetadata } from './isParentBindingMetadata';

export function isParentBindingMetadataWithServiceId(
  serviceId: ServiceIdentifier,
): (metadata: BindingMetadata) => boolean {
  return isParentBindingMetadata(isBindingMetadataWithServiceId(serviceId));
}
