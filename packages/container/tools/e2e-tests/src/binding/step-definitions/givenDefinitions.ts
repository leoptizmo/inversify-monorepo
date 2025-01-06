import { Given } from '@cucumber/cucumber';
import { BindInWhenOnFluentSyntax, Container } from '@inversifyjs/container';
import { BindingScope, bindingScopeValues } from '@inversifyjs/core';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyWorld } from '../../common/models/InversifyWorld';
import { setBinding } from '../actions/setBinding';
import { BindingParameterKind } from '../models/BindingParameterKind';

function givenBindingToConstantValue(
  this: InversifyWorld,
  serviceId: string,
  bindingAlias?: string,
): void {
  const parsedBindingAlias: string = bindingAlias ?? defaultAlias;
  const bindingValue: unknown = Symbol();

  setBinding.bind(this)(parsedBindingAlias, {
    bind: (container: Container): void => {
      container.bind(serviceId).toConstantValue(bindingValue);
    },
    kind: BindingParameterKind.constantValue,
    serviceIdentifier: serviceId,
    value: bindingValue,
  });
}

function givenBindingToDynamicValue(
  this: InversifyWorld,
  serviceId: string,
  scope: BindingScope,
  bindingAlias?: string,
): void {
  const parsedBindingAlias: string = bindingAlias ?? defaultAlias;

  setBinding.bind(this)(parsedBindingAlias, {
    bind: (container: Container): void => {
      const bindSyntax: BindInWhenOnFluentSyntax<unknown> = container
        .bind(serviceId)
        .toDynamicValue(() => Symbol());

      switch (scope) {
        case bindingScopeValues.Request:
          bindSyntax.inRequestScope();
          break;
        case bindingScopeValues.Singleton:
          bindSyntax.inSingletonScope();
          break;
        case bindingScopeValues.Transient:
          bindSyntax.inTransientScope();
          break;
      }
    },
    kind: BindingParameterKind.dynamicValue,
    serviceIdentifier: serviceId,
  });
}

Given<InversifyWorld>(
  'a service {string} binding to constant value',
  function (serviceId: string): void {
    givenBindingToConstantValue.bind(this)(serviceId);
  },
);

Given<InversifyWorld>(
  'a service {string} binding to dynamic value in {bindingScope} scope',
  function (serviceId: string, scope: BindingScope): void {
    givenBindingToDynamicValue.bind(this)(serviceId, scope);
  },
);
