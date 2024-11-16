import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { UnmanagedClassElementMetadata } from '../models/UnmanagedClassElementMetadata';

export function buildDefaultUnmanagedMetadata(): UnmanagedClassElementMetadata {
  return {
    kind: ClassElementMetadataKind.unmanaged,
  };
}
