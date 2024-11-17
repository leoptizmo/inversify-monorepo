import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { MetadataTargetName } from '../models/MetadataTargetName';

export function updateMetadataTargetName(
  targetName: MetadataTargetName,
): (
  metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata,
) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata {
  return (
    metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata,
  ): ManagedClassElementMetadata | MaybeManagedClassElementMetadata => {
    if (metadata.targetName !== undefined) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.injectionDecoratorConflict,
        'Unexpected duplicated targetName decorator',
      );
    }

    metadata.targetName = targetName;

    return metadata;
  };
}
