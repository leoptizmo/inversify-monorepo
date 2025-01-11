import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';

export function buildDefaultMaybeClassElementMetadata(): MaybeManagedClassElementMetadata {
  return {
    kind: MaybeClassElementMetadataKind.unknown,
    name: undefined,
    optional: false,
    tags: new Map(),
  };
}
