import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingMetadata } from '@inversifyjs/core';

export function isBindingMetadataWithServiceId(
  serviceId: ServiceIdentifier,
): (metadata: BindingMetadata) => boolean {
  return (metadata: BindingMetadata): boolean =>
    metadata.serviceIdentifier === serviceId;
}
