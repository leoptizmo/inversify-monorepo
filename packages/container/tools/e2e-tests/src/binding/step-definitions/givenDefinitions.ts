import { Given } from '@cucumber/cucumber';
import { Newable } from '@inversifyjs/common';
import {
  BindInFluentSyntax,
  BindInWhenOnFluentSyntax,
  BindOnFluentSyntax,
  BindWhenFluentSyntax,
  BindWhenOnFluentSyntax,
  Container,
} from '@inversifyjs/container';
import {
  BindingScope,
  bindingScopeValues,
  MetadataName,
  MetadataTag,
} from '@inversifyjs/core';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyWorld } from '../../common/models/InversifyWorld';
import { DualWieldSwordsman } from '../../warrior/models/DualWieldSwordsman';
import { setBinding } from '../actions/setBinding';
import { BindingParameterKind } from '../models/BindingParameterKind';

function bindInScope(
  scope: BindingScope,
): (
  bindInFluentSyntax: BindInFluentSyntax<unknown>,
) => BindWhenOnFluentSyntax<unknown> {
  return (
    bindInFluentSyntax: BindInFluentSyntax<unknown>,
  ): BindWhenOnFluentSyntax<unknown> => {
    switch (scope) {
      case bindingScopeValues.Request:
        return bindInFluentSyntax.inRequestScope();

      case bindingScopeValues.Singleton:
        return bindInFluentSyntax.inSingletonScope();

      case bindingScopeValues.Transient:
        return bindInFluentSyntax.inTransientScope();
    }
  };
}

function bindWhenNamed(
  name: MetadataName,
): (
  bindInFluentSyntax: BindWhenFluentSyntax<unknown>,
) => BindOnFluentSyntax<unknown> {
  return (
    bindInFluentSyntax: BindWhenFluentSyntax<unknown>,
  ): BindOnFluentSyntax<unknown> => {
    return bindInFluentSyntax.whenNamed(name);
  };
}

function bindWhenTagged(
  tag: MetadataTag,
  tagValue: unknown,
): (
  bindInFluentSyntax: BindWhenFluentSyntax<unknown>,
) => BindOnFluentSyntax<unknown> {
  return (
    bindInFluentSyntax: BindWhenFluentSyntax<unknown>,
  ): BindOnFluentSyntax<unknown> => {
    return bindInFluentSyntax.whenTagged(tag, tagValue);
  };
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
  scope?: BindingScope,
  bindingAlias?: string,
): void {
  const parsedBindingScope: BindingScope =
    scope ?? bindingScopeValues.Singleton;
  const parsedBindingAlias: string = bindingAlias ?? defaultAlias;

  setBinding.bind(this)(parsedBindingAlias, {
    bind: (container: Container): void => {
      bindInScope(parsedBindingScope)(
        container.bind(serviceId).toDynamicValue(() => Symbol()),
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

function givenTypeBinding(
  this: InversifyWorld,
  type: Newable,
  bindInScope?: (
    bindInFluentSyntax: BindInFluentSyntax<unknown>,
  ) => BindWhenOnFluentSyntax<unknown>,
  bindWhen?: (
    bindInFluentSyntax: BindWhenOnFluentSyntax<unknown>,
  ) => BindOnFluentSyntax<unknown>,
  bindingAlias?: string,
  serviceIdentifier?: string,
): void {
  const parsedBindingAlias: string = bindingAlias ?? defaultAlias;

  setBinding.bind(this)(parsedBindingAlias, {
    bind: (container: Container): void => {
      const bindInWhenOn: BindInWhenOnFluentSyntax<unknown> =
        serviceIdentifier === undefined
          ? container.bind(type).toSelf()
          : container.bind(serviceIdentifier).to(type);

      const bindWhenOn: BindWhenOnFluentSyntax<unknown> =
        bindInScope === undefined ? bindInWhenOn : bindInScope(bindInWhenOn);

      if (bindWhen !== undefined) {
        bindWhen(bindWhenOn);
      }
    },
    kind: BindingParameterKind.instance,
    serviceIdentifier: serviceIdentifier ?? type,
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
  'a service {string} dual wield swordsman type binding',
  function (serviceId: string): void {
    givenDualWieldSwordmanTypeBinding.bind(this)(serviceId);
  },
);

Given<InversifyWorld>(
  'a {warriorRelatedType} type binding as {string} in {bindingScope} scope',
  function (
    warriorRelatedType: Newable,
    bindingAlias: string,
    scope: BindingScope,
  ): void {
    givenTypeBinding.bind(this)(
      warriorRelatedType,
      bindInScope(scope),
      undefined,
      bindingAlias,
    );
  },
);

Given<InversifyWorld>(
  'a service {string} {warriorRelatedType} type binding as {string}',
  function (
    serviceId: string,
    warriorRelatedType: Newable,
    bindingAlias: string,
  ): void {
    givenTypeBinding.bind(this)(
      warriorRelatedType,
      undefined,
      undefined,
      bindingAlias,
      serviceId,
    );
  },
);

Given<InversifyWorld>(
  'a service {string} {warriorRelatedType} type binding as {string} when named {string}',
  function (
    serviceId: string,
    warriorRelatedType: Newable,
    bindingAlias: string,
    name: string,
  ): void {
    givenTypeBinding.bind(this)(
      warriorRelatedType,
      undefined,
      bindWhenNamed(name),
      bindingAlias,
      serviceId,
    );
  },
);

Given<InversifyWorld>(
  'a service {string} {warriorRelatedType} type binding as {string} when tagged {string} to {string}',
  function (
    serviceId: string,
    warriorRelatedType: Newable,
    bindingAlias: string,
    tag: string,
    tagValue: string,
  ): void {
    givenTypeBinding.bind(this)(
      warriorRelatedType,
      undefined,
      bindWhenTagged(tag, tagValue),
      bindingAlias,
      serviceId,
    );
  },
);
