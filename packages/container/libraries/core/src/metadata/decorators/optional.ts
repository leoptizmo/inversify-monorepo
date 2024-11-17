import { updateMetadataOptional } from '../actions/updateMetadataOptional';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { injectBase } from './injectBase';

export function optional(): ParameterDecorator & PropertyDecorator {
  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ): void => {
    const updateMetadata: (
      metadata: MaybeClassElementMetadata | undefined,
    ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata =
      buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
        updateMetadataOptional,
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
