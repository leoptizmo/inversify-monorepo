import { ServiceIdentifier } from '@inversifyjs/common';

import { Binding } from '../../binding/models/Binding';
import { BindingMetadata } from '../../binding/models/BindingMetadata';
import { BasePlanParams } from '../models/BasePlanParams';

export interface BuildFilteredServiceBindingsOptions {
  customServiceIdentifier?: ServiceIdentifier;
}

export function buildFilteredServiceBindings(
  params: BasePlanParams,
  bindingMetadata: BindingMetadata,
  options?: BuildFilteredServiceBindingsOptions,
): Binding<unknown>[] {
  const serviceIdentifier: ServiceIdentifier =
    options?.customServiceIdentifier ?? bindingMetadata.serviceIdentifier;

  const serviceBindings: Binding<unknown>[] = [
    ...(params.getBindings(serviceIdentifier) ?? []),
  ];

  return serviceBindings.filter((binding: Binding<unknown>): boolean =>
    binding.isSatisfiedBy(bindingMetadata),
  );
}
