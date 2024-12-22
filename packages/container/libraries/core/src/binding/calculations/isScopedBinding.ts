import {
  Binding,
  BindingScope,
  BindingType,
  ScopedBinding,
} from '@inversifyjs/core';

export function isScopedBinding<T>(
  binding: Binding<T>,
): binding is Binding<T> & ScopedBinding<BindingType, BindingScope, T> {
  return (
    (binding as Partial<ScopedBinding<BindingType, BindingScope, T>>).scope !==
    undefined
  );
}
