import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { UnmanagedClassElementMetadata } from '../models/UnmanagedClassElementMetadata';
import { assertMetadataFromTypescriptIfManaged } from './assertMetadataFromTypescriptIfManaged';
import { buildDefaultUnmanagedMetadata } from './buildDefaultUnmanagedMetadata';

export function buildUnmanagedMetadataFromMaybeManagedMetadata(
  metadata: MaybeManagedClassElementMetadata | ManagedClassElementMetadata,
): UnmanagedClassElementMetadata {
  assertMetadataFromTypescriptIfManaged(metadata);

  if (hasManagedMetadata(metadata)) {
    throw new InversifyCoreError(
      InversifyCoreErrorKind.injectionDecoratorConflict,
      'Unexpected injection found. Found @unmanaged injection with additional @named, @optional, @tagged or @targetName injections',
    );
  }

  return buildDefaultUnmanagedMetadata();
}

function hasManagedMetadata(
  metadata: MaybeManagedClassElementMetadata | ManagedClassElementMetadata,
): boolean {
  return (
    metadata.name !== undefined || metadata.optional || metadata.tags.size > 0
  );
}
