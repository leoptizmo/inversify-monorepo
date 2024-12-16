import { incrementPendingClassMetadataCount } from '../actions/incrementPendingClassMetadataCount';
import { updateMetadataTag } from '../actions/updateMetadataTag';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { MetadataTag } from '../models/MetadataTag';
import { injectBase } from './injectBase';

export function tagged(
  key: MetadataTag,
  value: unknown,
): ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata =
    buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
      updateMetadataTag(key, value),
    );

  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ): void => {
    try {
      if (parameterIndex === undefined) {
        injectBase(updateMetadata, incrementPendingClassMetadataCount)(
          target,
          propertyKey as string | symbol,
        );
      } else {
        injectBase(updateMetadata, incrementPendingClassMetadataCount)(
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
