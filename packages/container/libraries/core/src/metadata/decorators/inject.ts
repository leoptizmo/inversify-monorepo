import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { decrementPendingClassMetadataCount } from '../actions/decrementPendingClassMetadataCount';
import { buildManagedMetadataFromMaybeClassElementMetadata } from '../calculations/buildManagedMetadataFromMaybeClassElementMetadata';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { injectBase } from './injectBase';

export function inject(
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier,
): MethodDecorator & ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    classElementMetadata: MaybeClassElementMetadata | undefined,
  ) => ClassElementMetadata = buildManagedMetadataFromMaybeClassElementMetadata(
    ClassElementMetadataKind.singleInjection,
    serviceIdentifier,
  );

  return injectBase(updateMetadata, decrementPendingClassMetadataCount);
}
