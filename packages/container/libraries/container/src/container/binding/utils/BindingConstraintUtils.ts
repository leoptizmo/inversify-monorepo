import { BindingMetadata } from '@inversifyjs/core';

export class BindingConstraintUtils {
  public static readonly always: (bindingMetadata: BindingMetadata) => boolean =
    (_bindingMetadata: BindingMetadata): boolean => {
      return true;
    };
}
