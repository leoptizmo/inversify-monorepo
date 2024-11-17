import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { MetadataName } from '../models/MetadataName';

export function updateMetadataName(
  name: MetadataName,
): (
  metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata,
) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata {
  return (
    metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata,
  ): ManagedClassElementMetadata | MaybeManagedClassElementMetadata => {
    if (metadata.name !== undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        'Unexpected duplicated named decorator',
      );
    }

    metadata.name = name;

    return metadata;
  };
}
