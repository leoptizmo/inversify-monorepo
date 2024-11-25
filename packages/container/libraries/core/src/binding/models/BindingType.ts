export type BindingType =
  | 'ConstantValue'
  | 'Constructor'
  | 'DynamicValue'
  | 'Factory'
  | 'Instance'
  | 'Provider'
  | 'ServiceRedirection';

export const bindingTypeValues: { [TKey in BindingType]: TKey } = {
  ConstantValue: 'ConstantValue',
  Constructor: 'Constructor',
  DynamicValue: 'DynamicValue',
  Factory: 'Factory',
  Instance: 'Instance',
  Provider: 'Provider',
  ServiceRedirection: 'ServiceRedirection',
};
