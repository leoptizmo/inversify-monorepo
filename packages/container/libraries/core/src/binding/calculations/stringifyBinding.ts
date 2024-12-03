import { stringifyServiceIdentifier } from '@inversifyjs/common';

import { Binding } from '../models/Binding';
import { bindingTypeValues } from '../models/BindingType';

export function stringifyBinding(binding: Binding): string {
  switch (binding.type) {
    case bindingTypeValues.Instance:
      return `[ type: "${binding.type}", serviceIdentifier: "${stringifyServiceIdentifier(binding.serviceIdentifier)}", scope: "${binding.scope}", implementationType: "${binding.implementationType.name}" ]`;
    case bindingTypeValues.ServiceRedirection:
      return `[ type: "${binding.type}", serviceIdentifier: "${stringifyServiceIdentifier(binding.serviceIdentifier)}", redirection: "${stringifyServiceIdentifier(binding.targetServiceIdentifier)}" ]`;
    default:
      return `[ type: "${binding.type}", serviceIdentifier: "${stringifyServiceIdentifier(binding.serviceIdentifier)}", scope: "${binding.scope}" ]`;
  }
}
