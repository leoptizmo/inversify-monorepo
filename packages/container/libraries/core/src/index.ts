import { getClassMetadata } from './metadata/calculations/getClassMetadata';
import { ClassElementMetadata } from './metadata/models/ClassElementMetadata';
import { ClassElementMetadataKind } from './metadata/models/ClassElementMetadataKind';
import { ClassMetadata } from './metadata/models/ClassMetadata';
import { ClassMetadataLifecycle } from './metadata/models/ClassMetadataLifecycle';
import { ManagedClassElementMetadata } from './metadata/models/ManagedClassElementMetadata';
import { MetadataName } from './metadata/models/MetadataName';
import { MetadataTag } from './metadata/models/MetadataTag';
import { MetadataTargetName } from './metadata/models/MetadataTargetName';
import { UnmanagedClassElementMetadata } from './metadata/models/UnmanagedClassElementMetadata';

export type {
  ClassElementMetadata,
  ClassMetadata,
  ClassMetadataLifecycle,
  ManagedClassElementMetadata,
  MetadataName,
  MetadataTag,
  MetadataTargetName,
  UnmanagedClassElementMetadata,
};

export { ClassElementMetadataKind, getClassMetadata };
