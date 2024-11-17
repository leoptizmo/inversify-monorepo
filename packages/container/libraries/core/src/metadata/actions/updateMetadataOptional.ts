import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';

export function updateMetadataOptional(
  metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata,
): ManagedClassElementMetadata | MaybeManagedClassElementMetadata {
  if (metadata.optional) {
    throw new InversifyCoreError(
      InversifyCoreErrorKind.injectionDecoratorConflict,
      'Unexpected duplicated optional decorator',
    );
  }

  metadata.optional = true;

  return metadata;
}
