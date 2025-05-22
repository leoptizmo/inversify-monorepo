import { BindingConstraints } from '@gritcode/inversifyjs-core';

export class BindingConstraintUtils {
  public static readonly always: (
    bindingConstraints: BindingConstraints,
  ) => boolean = (_bindingConstraints: BindingConstraints): boolean => {
    return true;
  };
}
