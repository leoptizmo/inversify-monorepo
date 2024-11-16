import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { UnmanagedClassElementMetadata } from '../models/UnmanagedClassElementMetadata';
import { buildDefaultUnmanagedMetadata } from './buildDefaultUnmanagedMetadata';

export function buildUnmanagedMetadataFromMaybeManagedMetadata(
  metadata: MaybeManagedClassElementMetadata,
): UnmanagedClassElementMetadata {
  if (hasManagedMetadata(metadata)) {
    throw new InversifyCoreError(
      InversifyCoreErrorKind.injectionDecoratorConflict,
      'Unexpected injection found. Found @unmanaged injection with additional @named, @optional, @tagged or @targetName injections',
    );
  }

  return buildDefaultUnmanagedMetadata();
}

function hasManagedMetadata(
  metadata: MaybeManagedClassElementMetadata,
): boolean {
  return (
    metadata.name !== undefined ||
    metadata.optional ||
    metadata.tags.size > 0 ||
    metadata.targetName !== undefined
  );
}
