import { BindingConstraints } from '@gritcode/inversifyjs-core';
import { ServiceIdentifier } from '@inversifyjs/common';

export function isBindingConstraintsWithServiceId(
  serviceId: ServiceIdentifier,
): (constraints: BindingConstraints) => boolean {
  return (constraints: BindingConstraints): boolean =>
    constraints.serviceIdentifier === serviceId;
}
