import { getTargets } from './legacyTarget/calculations/getTargets';
import { LegacyTarget } from './legacyTarget/models/LegacyTarget';
import { LegacyTargetType } from './legacyTarget/models/LegacyTargetType';
import { getClassMetadata } from './metadata/calculations/getClassMetadata';
import { getClassMetadataFromMetadataReader } from './metadata/calculations/getClassMetadataFromMetadataReader';
import { ClassElementMetadata } from './metadata/models/ClassElementMetadata';
import { ClassElementMetadataKind } from './metadata/models/ClassElementMetadataKind';
import { ClassMetadata } from './metadata/models/ClassMetadata';
import { ClassMetadataLifecycle } from './metadata/models/ClassMetadataLifecycle';
import { LegacyMetadata } from './metadata/models/LegacyMetadata';
import { LegacyMetadataMap } from './metadata/models/LegacyMetadataMap';
import { LegacyMetadataReader } from './metadata/models/LegacyMetadataReader';
import { ManagedClassElementMetadata } from './metadata/models/ManagedClassElementMetadata';
import { MetadataName } from './metadata/models/MetadataName';
import { MetadataTag } from './metadata/models/MetadataTag';
import { MetadataTargetName } from './metadata/models/MetadataTargetName';
import { UnmanagedClassElementMetadata } from './metadata/models/UnmanagedClassElementMetadata';
import { LegacyQueryableString } from './string/models/LegacyQueryableString';

export type {
  ClassElementMetadata,
  ClassMetadata,
  ClassMetadataLifecycle,
  LegacyMetadata,
  LegacyMetadataMap,
  LegacyMetadataReader,
  LegacyQueryableString,
  LegacyTarget,
  LegacyTargetType,
  ManagedClassElementMetadata,
  MetadataName,
  MetadataTag,
  MetadataTargetName,
  UnmanagedClassElementMetadata,
};

export {
  ClassElementMetadataKind,
  getClassMetadata,
  getClassMetadataFromMetadataReader,
  getTargets,
};
