import { BindingConstraints, MetadataName } from '@inversifyjs/core';

export function isBindingConstraintsWithName(
  name: MetadataName,
): (constraints: BindingConstraints) => boolean {
  return (constraints: BindingConstraints): boolean =>
    constraints.name === name;
}
