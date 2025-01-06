import { Given } from '@cucumber/cucumber';
import { Container } from '@inversifyjs/container';

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

Given<InversifyWorld>(
  'a service {string} binding to constant value',
  function (serviceId: string): void {
    givenBindingToConstantValue.bind(this)(serviceId);
  },
);
