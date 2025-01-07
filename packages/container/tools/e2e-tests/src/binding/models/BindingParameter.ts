import { ConstantValueBindingParameter } from './ConstantValueBindingParameter';
import { DynamicValueBindingParameter } from './DynamicValueBindingParameter';
import { InstanceBindingParameter } from './InstanceBindingParameter';

export type BindingParameter =
  | ConstantValueBindingParameter
  | DynamicValueBindingParameter
  | InstanceBindingParameter;
