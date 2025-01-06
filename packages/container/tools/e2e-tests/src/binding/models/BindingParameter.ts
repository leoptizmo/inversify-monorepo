import { ConstantValueBindingParameter } from './ConstantValueBindingParameter';
import { DynamicValueBindingParameter } from './DynamicValueBindingParameter';

export type BindingParameter =
  | ConstantValueBindingParameter
  | DynamicValueBindingParameter;
