export type BindingType =
  | 'ConstantValue'
  | 'DynamicValue'
  | 'Factory'
  | 'Instance'
  | 'Provider'
  | 'ResolvedValue'
  | 'ServiceRedirection';

export const bindingTypeValues: { [TKey in BindingType]: TKey } = {
  ConstantValue: 'ConstantValue',
  DynamicValue: 'DynamicValue',
  Factory: 'Factory',
  Instance: 'Instance',
  Provider: 'Provider',
  ResolvedValue: 'ResolvedValue',
  ServiceRedirection: 'ServiceRedirection',
};
