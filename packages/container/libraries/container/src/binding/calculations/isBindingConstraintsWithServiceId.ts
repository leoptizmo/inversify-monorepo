import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingConstraints } from '@inversifyjs/core';

export function isBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return (constraints: BindingConstraints): boolean =>
    constraints.serviceIdentifier === serviceId;
}
