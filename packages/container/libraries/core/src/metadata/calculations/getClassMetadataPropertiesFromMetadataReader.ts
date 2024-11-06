import { Newable } from '@inversifyjs/common';

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { LegacyMetadataMap } from '../models/LegacyMetadataMap';
import { LegacyMetadataReader } from '../models/LegacyMetadataReader';
import { getPropertyMetadataFromLegacyMetadata } from './getPropertyMetadataFromLegacyMetadata';

export function getClassMetadataPropertiesFromMetadataReader(
  type: Newable,
  metadataReader: LegacyMetadataReader,
): Map<string | symbol, ClassElementMetadata> {
  const propertiesLegacyMetadata: LegacyMetadataMap =
    metadataReader.getPropertiesMetadata(type);

  const propertiesMetadata: Map<string | symbol, ClassElementMetadata> =
    new Map();

  for (const property of Reflect.ownKeys(propertiesLegacyMetadata)) {
    const legacyMetadata: LegacyMetadata[] = propertiesLegacyMetadata[
      property
    ] as LegacyMetadata[];
    propertiesMetadata.set(
      property,
      getPropertyMetadataFromLegacyMetadata(type, property, legacyMetadata),
    );
  }

  return propertiesMetadata;
}
