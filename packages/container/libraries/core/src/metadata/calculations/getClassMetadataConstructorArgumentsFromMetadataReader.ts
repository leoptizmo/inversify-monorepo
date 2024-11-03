import { Newable } from '@inversifyjs/common';

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { LegacyConstructorMetadata } from '../models/LegacyConstructorMetadata';
import { LegacyMetadataReader } from '../models/LegacyMetadataReader';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';
import { getClassElementMetadataFromNewable } from './getClassElementMetadataFromNewable';

export function getClassMetadataConstructorArgumentsFromMetadataReader(
  type: Newable,
  metadataReader: LegacyMetadataReader,
): ClassElementMetadata[] {
  const legacyConstructorMetadata: LegacyConstructorMetadata =
    metadataReader.getConstructorMetadata(type);

  const constructorArgumentsMetadata: ClassElementMetadata[] = [];

  for (const [stringifiedIndex, metadataList] of Object.entries(
    legacyConstructorMetadata.userGeneratedMetadata,
  )) {
    const index: number = parseInt(stringifiedIndex);

    constructorArgumentsMetadata[index] =
      getClassElementMetadataFromLegacyMetadata(metadataList);
  }

  if (legacyConstructorMetadata.compilerGeneratedMetadata !== undefined) {
    for (
      let i: number = 0;
      i < legacyConstructorMetadata.compilerGeneratedMetadata.length;
      ++i
    ) {
      if (constructorArgumentsMetadata[i] === undefined) {
        const typescriptMetadata: Newable = legacyConstructorMetadata
          .compilerGeneratedMetadata[i] as Newable;

        constructorArgumentsMetadata[i] =
          getClassElementMetadataFromNewable(typescriptMetadata);
      }
    }
  }

  return constructorArgumentsMetadata;
}
