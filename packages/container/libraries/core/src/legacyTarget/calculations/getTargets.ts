import { Newable } from '@inversifyjs/common';

import { getClassMetadata } from '../../metadata/calculations/getClassMetadata';
import { getClassMetadataFromMetadataReader } from '../../metadata/calculations/getClassMetadataFromMetadataReader';
import { getClassMetadataProperties } from '../../metadata/calculations/getClassMetadataProperties';
import { getClassMetadataPropertiesFromMetadataReader } from '../../metadata/calculations/getClassMetadataPropertiesFromMetadataReader';
import { ClassElementMetadata } from '../../metadata/models/ClassElementMetadata';
import { ClassMetadata } from '../../metadata/models/ClassMetadata';
import { LegacyMetadataReader } from '../../metadata/models/LegacyMetadataReader';
import { LegacyTarget } from '../models/LegacyTarget';
import { getTargetsFromMetadataProviders } from './getTargetsFromMetadataProviders';

export const getTargets: (
  metadataReader?: LegacyMetadataReader,
) => (type: Newable) => LegacyTarget[] = (
  metadataReader?: LegacyMetadataReader,
): ((type: Newable) => LegacyTarget[]) => {
  const getClassMetadataFn: (type: Newable) => ClassMetadata =
    metadataReader === undefined
      ? getClassMetadata
      : (type: Newable): ClassMetadata =>
          getClassMetadataFromMetadataReader(type, metadataReader);
  const getClassMetadataPropertiesFn: (
    type: Newable,
  ) => Map<string | symbol, ClassElementMetadata> =
    metadataReader === undefined
      ? getClassMetadataProperties
      : (type: Newable): Map<string | symbol, ClassElementMetadata> =>
          getClassMetadataPropertiesFromMetadataReader(type, metadataReader);

  return getTargetsFromMetadataProviders(
    getClassMetadataFn,
    getClassMetadataPropertiesFn,
  );
};
