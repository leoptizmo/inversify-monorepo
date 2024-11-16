import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { buildManagedMetadataFromMaybeClassElementMetadata } from '../calculations/buildManagedMetadataFromMaybeClassElementMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { injectBase } from './injectBase';

export function multiInject(
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier,
): ParameterDecorator & PropertyDecorator {
  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ): void => {
    const updateMetadata: (
      classElementMetadata: MaybeClassElementMetadata | undefined,
    ) => ClassElementMetadata =
      buildManagedMetadataFromMaybeClassElementMetadata(
        ClassElementMetadataKind.multipleInjection,
        serviceIdentifier,
      );

    try {
      if (parameterIndex === undefined) {
        injectBase(updateMetadata)(target, propertyKey as string | symbol);
      } else {
        injectBase(updateMetadata)(target, propertyKey, parameterIndex);
      }
    } catch (error: unknown) {
      handleInjectionError(target, propertyKey, parameterIndex, error);
    }
  };
}
