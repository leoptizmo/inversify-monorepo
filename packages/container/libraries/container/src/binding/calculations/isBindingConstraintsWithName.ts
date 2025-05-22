import { BindingConstraints, MetadataName } from '@gritcode/inversifyjs-core';

export function isBindingConstraintsWithName(
  name: MetadataName,
): (constraints: BindingConstraints) => boolean {
  return (constraints: BindingConstraints): boolean =>
    constraints.name === name;
}
