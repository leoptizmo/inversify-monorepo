import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';

export function buildClassElementMetadataFromMaybeClassElementMetadata<
  TParams extends unknown[],
>(
  buildDefaultMetadata: (...params: TParams) => ClassElementMetadata,
  buildMetadataFromMaybeManagedMetadata: (
    metadata: MaybeManagedClassElementMetadata,
    ...params: TParams
  ) => ClassElementMetadata,
): (
  ...params: TParams
) => (metadata: MaybeClassElementMetadata | undefined) => ClassElementMetadata {
  return (...params: TParams) =>
    (metadata: MaybeClassElementMetadata | undefined): ClassElementMetadata => {
      if (metadata === undefined) {
        return buildDefaultMetadata(...params);
      }

      switch (metadata.kind) {
        case MaybeClassElementMetadataKind.unknown:
          return buildMetadataFromMaybeManagedMetadata(metadata, ...params);
        default:
          throw new InversifyCoreError(
            InversifyCoreErrorKind.injectionDecoratorConflict,
            'Unexpected injection found. Multiple @inject, @multiInject or @unmanaged decorators found',
          );
      }
    };
}
