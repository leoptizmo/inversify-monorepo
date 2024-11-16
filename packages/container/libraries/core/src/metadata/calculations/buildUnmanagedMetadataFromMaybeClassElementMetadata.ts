import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { buildClassElementMetadataFromMaybeClassElementMetadata } from './buildClassElementMetadataFromMaybeClassElementMetadata';
import { buildDefaultUnmanagedMetadata } from './buildDefaultUnmanagedMetadata';
import { buildUnmanagedMetadataFromMaybeManagedMetadata } from './buildUnmanagedMetadataFromMaybeManagedMetadata';

export const buildUnmanagedMetadataFromMaybeClassElementMetadata: () => (
  metadata: MaybeClassElementMetadata | undefined,
) => ClassElementMetadata =
  buildClassElementMetadataFromMaybeClassElementMetadata(
    buildDefaultUnmanagedMetadata,
    buildUnmanagedMetadataFromMaybeManagedMetadata,
  );
