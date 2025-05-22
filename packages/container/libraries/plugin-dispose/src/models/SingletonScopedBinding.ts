import {
  Binding,
  bindingScopeValues,
  BindingType,
  ScopedBinding,
} from '@gritcode/inversifyjs-core';

export type SingletonScopedBinding = Binding &
  ScopedBinding<BindingType, typeof bindingScopeValues.Singleton, unknown>;
