import { BaseBinding, BindingType } from '@inversifyjs/core';

import {
  BindingIdentifier,
  bindingIdentifierSymbol,
} from '../models/BindingIdentifier';

export function buildBindingIdentifier(
  binding: BaseBinding<BindingType, unknown>,
): BindingIdentifier {
  return {
    [bindingIdentifierSymbol]: true,
    id: binding.id,
  };
}
