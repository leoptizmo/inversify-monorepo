import { BaseBindingParameter } from './BaseBindingParameter';
import { BindingParameterKind } from './BindingParameterKind';

export type DynamicValueBindingParameter =
  BaseBindingParameter<BindingParameterKind.dynamicValue>;
