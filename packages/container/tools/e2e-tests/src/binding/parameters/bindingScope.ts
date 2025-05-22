import { defineParameterType } from '@cucumber/cucumber';
import { BindingScope, bindingScopeValues } from '@gritcode/inversifyjs-core';

defineParameterType({
  name: 'bindingScope',
  regexp: new RegExp(`"(${Object.values(bindingScopeValues).join('|')})"`),
  transformer: function (bindingScope: string): BindingScope {
    return bindingScope as BindingScope;
  },
});
