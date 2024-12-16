import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { decrementPendingClassMetadataCount } from '../actions/decrementPendingClassMetadataCount';
import { buildManagedMetadataFromMaybeClassElementMetadata } from '../calculations/buildManagedMetadataFromMaybeClassElementMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { injectBase } from './injectBase';

export function inject(
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier,
): ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    classElementMetadata: MaybeClassElementMetadata | undefined,
  ) => ClassElementMetadata = buildManagedMetadataFromMaybeClassElementMetadata(
    ClassElementMetadataKind.singleInjection,
    serviceIdentifier,
  );

  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ): void => {
    try {
      if (parameterIndex === undefined) {
        injectBase(updateMetadata, decrementPendingClassMetadataCount)(
          target,
          propertyKey as string | symbol,
        );
      } else {
        injectBase(updateMetadata, decrementPendingClassMetadataCount)(
          target,
          propertyKey,
          parameterIndex,
        );
      }
    } catch (error: unknown) {
      handleInjectionError(target, propertyKey, parameterIndex, error);
    }
  };
}
