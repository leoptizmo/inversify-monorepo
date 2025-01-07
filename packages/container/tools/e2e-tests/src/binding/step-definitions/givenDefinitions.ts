import { Given } from '@cucumber/cucumber';
import { BindInFluentSyntax, Container } from '@inversifyjs/container';
import { BindingScope, bindingScopeValues } from '@inversifyjs/core';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyWorld } from '../../common/models/InversifyWorld';
import { DualWieldSwordsman } from '../../warrior/models/DualWieldSwordsman';
import { Sword } from '../../warrior/models/Sword';
import { setBinding } from '../actions/setBinding';
import { BindingParameterKind } from '../models/BindingParameterKind';

function bindInScopeSyntax(
  bindInFluentSyntax: BindInFluentSyntax<unknown>,
  scope: BindingScope,
): void {
  switch (scope) {
    case bindingScopeValues.Request:
      bindInFluentSyntax.inRequestScope();
      break;
    case bindingScopeValues.Singleton:
      bindInFluentSyntax.inSingletonScope();
      break;
    case bindingScopeValues.Transient:
      bindInFluentSyntax.inTransientScope();
      break;
  }
}

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
      bindInScopeSyntax(
        container.bind(serviceId).toDynamicValue(() => Symbol()),
        scope,
      );
    },
    kind: BindingParameterKind.dynamicValue,
    serviceIdentifier: serviceId,
  });
}

function givenDualWieldSwordmanTypeBinding(
  this: InversifyWorld,
  serviceId: string,
  bindingAlias?: string,
): void {
  const parsedBindingAlias: string = bindingAlias ?? defaultAlias;

  setBinding.bind(this)(parsedBindingAlias, {
    bind: (container: Container): void => {
      container.bind(serviceId).to(DualWieldSwordsman);
    },
    kind: BindingParameterKind.instance,
    serviceIdentifier: serviceId,
  });
}

function givenSwordTypeBinding(
  this: InversifyWorld,
  scope: BindingScope,
  bindingAlias?: string,
): void {
  const parsedBindingAlias: string = bindingAlias ?? defaultAlias;

  setBinding.bind(this)(parsedBindingAlias, {
    bind: (container: Container): void => {
      bindInScopeSyntax(container.bind(Sword).toSelf(), scope);
    },
    kind: BindingParameterKind.instance,
    serviceIdentifier: Sword,
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

Given<InversifyWorld>(
  'a sword type binding as {string} in {bindingScope} scope',
  function (bindingAlias: string, scope: BindingScope): void {
    givenSwordTypeBinding.bind(this)(scope, bindingAlias);
  },
);

Given<InversifyWorld>(
  'a service {string} dual wield swordsman type binding',
  function (serviceId: string): void {
    givenDualWieldSwordmanTypeBinding.bind(this)(serviceId);
  },
);
