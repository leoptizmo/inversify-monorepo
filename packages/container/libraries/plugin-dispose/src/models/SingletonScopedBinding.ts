import {
  Binding,
  bindingScopeValues,
  BindingType,
  ScopedBinding,
} from '@inversifyjs/core';

export type SingletonScopedBinding = Binding &
  ScopedBinding<BindingType, typeof bindingScopeValues.Singleton, unknown>;
