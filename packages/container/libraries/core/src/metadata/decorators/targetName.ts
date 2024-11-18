import { updateMetadataTargetName } from '../actions/updateMetadataTargetName';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { MetadataTargetName } from '../models/MetadataTargetName';
import { injectBase } from './injectBase';

export function targetName(
  targetName: MetadataTargetName,
): ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata =
    buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
      updateMetadataTargetName(targetName),
    );

  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ): void => {
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
