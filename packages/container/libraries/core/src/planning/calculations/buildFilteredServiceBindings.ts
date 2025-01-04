import { ServiceIdentifier } from '@inversifyjs/common';

import { Binding } from '../../binding/models/Binding';
import {
  BindingMetadataImplementation,
  InternalBindingMetadata,
} from '../../binding/models/BindingMetadataImplementation';
import { SingleInmutableLinkedList } from '../../common/models/SingleInmutableLinkedList';
import { BasePlanParams } from '../models/BasePlanParams';

export interface BuildFilteredServiceBindingsOptions {
  customServiceIdentifier?: ServiceIdentifier;
}

export function buildFilteredServiceBindings(
  params: BasePlanParams,
  bindingMetadataList: SingleInmutableLinkedList<InternalBindingMetadata>,
  options?: BuildFilteredServiceBindingsOptions,
): Binding<unknown>[] {
  const bindingMetadata: BindingMetadataImplementation =
    new BindingMetadataImplementation(bindingMetadataList.last);

  const serviceIdentifier: ServiceIdentifier =
    options?.customServiceIdentifier ?? bindingMetadata.serviceIdentifier;

  const serviceBindings: Binding<unknown>[] = [
    ...(params.getBindings(serviceIdentifier) ?? []),
  ];

  return serviceBindings.filter((binding: Binding<unknown>): boolean =>
    binding.isSatisfiedBy(bindingMetadata),
  );
}
