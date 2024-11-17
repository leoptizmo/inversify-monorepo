import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { buildDefaultMaybeClassElementMetadata } from './buildDefaultMaybeClassElementMetadata';

export function buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
  updateMetadata: (
    metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata,
  ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata,
): (
  metadata: MaybeClassElementMetadata | undefined,
) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata {
  return (
    metadata: MaybeClassElementMetadata | undefined,
  ): ManagedClassElementMetadata | MaybeManagedClassElementMetadata => {
    const definedMetadata: MaybeClassElementMetadata =
      metadata ?? buildDefaultMaybeClassElementMetadata();

    switch (definedMetadata.kind) {
      case ClassElementMetadataKind.unmanaged:
        throw new InversifyCoreError(
          InversifyCoreErrorKind.injectionDecoratorConflict,
          'Unexpected injection found. Found @unmanaged injection with additional @named, @optional, @tagged or @targetName injections',
        );
      default:
        return updateMetadata(definedMetadata);
    }
  };
}
