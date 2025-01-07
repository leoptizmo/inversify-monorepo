import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';

export function buildClassElementMetadataFromMaybeClassElementMetadata<
  TParams extends unknown[],
>(
  buildDefaultMetadata: (...params: TParams) => ClassElementMetadata,
  buildMetadataFromMaybeManagedMetadata: (
    metadata: MaybeManagedClassElementMetadata | ManagedClassElementMetadata,
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

      if (metadata.kind === ClassElementMetadataKind.unmanaged) {
        throw new InversifyCoreError(
          InversifyCoreErrorKind.injectionDecoratorConflict,
          'Unexpected injection found. Multiple @inject, @multiInject or @unmanaged decorators found',
        );
      }

      return buildMetadataFromMaybeManagedMetadata(metadata, ...params);
    };
}
