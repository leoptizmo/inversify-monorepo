import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { TAGGED_PROP } from '../../reflectMetadata/data/keys';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { LegacyMetadataMap } from '../models/LegacyMetadataMap';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';

export function getClassMetadataProperties(
  type: Newable,
): Map<string | symbol, ClassElementMetadata> {
  const propertiesLegacyMetadata: LegacyMetadataMap | undefined =
    getReflectMetadata(type, TAGGED_PROP);

  const propertiesMetadata: Map<string | symbol, ClassElementMetadata> =
    new Map();

  if (propertiesLegacyMetadata !== undefined) {
    for (const property of Reflect.ownKeys(propertiesLegacyMetadata)) {
      const legacyMetadata: LegacyMetadata[] = propertiesLegacyMetadata[
        property
      ] as LegacyMetadata[];
      propertiesMetadata.set(
        property,
        getClassElementMetadataFromLegacyMetadata(legacyMetadata),
      );
    }
  }

  return propertiesMetadata;
}
