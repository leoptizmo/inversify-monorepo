import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { TAGGED_PROP } from '../../reflectMetadata/data/keys';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { LegacyMetadataMap } from '../models/LegacyMetadataMap';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';

export function getClassMetadataProperties<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
): Map<string | symbol, ClassElementMetadata> {
  const propertiesLegacyMetadata: LegacyMetadataMap | undefined =
    getReflectMetadata(type, TAGGED_PROP);

  const propertiesMetadata: Map<string | symbol, ClassElementMetadata> =
    new Map();

  if (propertiesLegacyMetadata !== undefined) {
    for (const [property, legacyMetadata] of Object.entries(
      propertiesLegacyMetadata,
    )) {
      propertiesMetadata.set(
        property,
        getClassElementMetadataFromLegacyMetadata(legacyMetadata),
      );
    }
  }

  return propertiesMetadata;
}
