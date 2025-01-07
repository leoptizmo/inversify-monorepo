import { BaseBindingParameter } from './BaseBindingParameter';
import { BindingParameterKind } from './BindingParameterKind';

export type InstanceBindingParameter =
  BaseBindingParameter<BindingParameterKind.instance>;
