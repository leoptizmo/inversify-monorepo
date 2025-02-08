import { Newable, ServiceIdentifier } from '@inversifyjs/common';

import { Binding } from '../../binding/models/Binding';
import { BindingConstraints } from '../../binding/models/BindingConstraints';
import { bindingTypeValues } from '../../binding/models/BindingType';
import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { BasePlanParams } from '../models/BasePlanParams';
import { BasePlanParamsAutobindOptions } from '../models/BasePlanParamsAutobindOptions';

export interface BuildFilteredServiceBindingsOptions {
  customServiceIdentifier?: ServiceIdentifier;
}

export function buildFilteredServiceBindings(
  params: BasePlanParams,
  bindingConstraints: BindingConstraints,
  options?: BuildFilteredServiceBindingsOptions,
): Binding<unknown>[] {
  const serviceIdentifier: ServiceIdentifier =
    options?.customServiceIdentifier ?? bindingConstraints.serviceIdentifier;

  const serviceBindings: Binding<unknown>[] = [
    ...(params.getBindings(serviceIdentifier) ?? []),
  ];

  const filteredBindings: Binding<unknown>[] = serviceBindings.filter(
    (binding: Binding<unknown>): boolean =>
      binding.isSatisfiedBy(bindingConstraints),
  );

  if (
    filteredBindings.length === 0 &&
    params.autobindOptions !== undefined &&
    typeof serviceIdentifier === 'function'
  ) {
    const binding: InstanceBinding<unknown> = buildInstanceBinding(
      params.autobindOptions,
      serviceIdentifier as Newable,
    );

    params.setBinding(binding);

    filteredBindings.push(binding);
  }

  return filteredBindings;
}

function buildInstanceBinding(
  autobindOptions: BasePlanParamsAutobindOptions,
  serviceIdentifier: Newable,
): InstanceBinding<unknown> {
  return {
    cache: {
      isRight: false,
      value: undefined,
    },
    id: 0,
    implementationType: serviceIdentifier,
    isSatisfiedBy: () => true,
    moduleId: undefined,
    onActivation: undefined,
    onDeactivation: undefined,
    scope: autobindOptions.scope,
    serviceIdentifier,
    type: bindingTypeValues.Instance,
  };
}
