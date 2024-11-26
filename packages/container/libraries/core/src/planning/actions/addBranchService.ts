import {
  ServiceIdentifier,
  stringifyServiceIdentifier,
} from '@inversifyjs/common';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { BasePlanParams } from '../models/BasePlanParams';

export function addBranchService(
  params: BasePlanParams,
  serviceIdentifier: ServiceIdentifier,
): void {
  if (params.servicesBranch.has(serviceIdentifier)) {
    throwError(params, serviceIdentifier);
  }

  params.servicesBranch.add(serviceIdentifier);
}

function stringifyServiceIdentifierTrace(
  serviceIdentifiers: Iterable<ServiceIdentifier>,
): string {
  return [...serviceIdentifiers].map(stringifyServiceIdentifier).join(' -> ');
}

function throwError(
  params: BasePlanParams,
  serviceIdentifier: ServiceIdentifier,
): never {
  const stringifiedCircularDependencies: string =
    stringifyServiceIdentifierTrace([
      ...params.servicesBranch,
      serviceIdentifier,
    ]);

  throw new InversifyCoreError(
    InversifyCoreErrorKind.planning,
    `Circular dependency found: ${stringifiedCircularDependencies}`,
  );
}
