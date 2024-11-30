import { BindingScope } from './BindingScope';
import { bindingTypeValues } from './BindingType';
import { DynamicValue } from './DynamicValue';
import { ScopedBinding } from './ScopedBinding';

export interface DynamicValueBinding<TActivated>
  extends ScopedBinding<
    typeof bindingTypeValues.DynamicValue,
    BindingScope,
    TActivated | Promise<TActivated>
  > {
  readonly value: DynamicValue<TActivated>;
}
