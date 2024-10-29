import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { DESIGN_PARAM_TYPES, TAGGED } from '../../reflectMetadata/data/keys';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { LegacyMetadataMap } from '../models/LegacyMetadataMap';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';
import { getClassElementMetadataFromNewable } from './getClassElementMetadataFromNewable';

export function getClassMetadataConstructorArguments<
  TInstance,
  TArgs extends unknown[],
>(type: Newable<TInstance, TArgs>): ClassElementMetadata[] {
  const typescriptMetadataList: Newable[] | undefined = getReflectMetadata(
    type,
    DESIGN_PARAM_TYPES,
  );

  const constructorParametersLegacyMetadata: LegacyMetadataMap | undefined =
    getReflectMetadata(type, TAGGED);

  const constructorArgumentsMetadata: ClassElementMetadata[] = [];

  if (constructorParametersLegacyMetadata !== undefined) {
    for (const [stringifiedIndex, metadataList] of Object.entries(
      constructorParametersLegacyMetadata,
    )) {
      const index: number = parseInt(stringifiedIndex);

      constructorArgumentsMetadata[index] =
        getClassElementMetadataFromLegacyMetadata(metadataList);
    }
  }

  if (typescriptMetadataList !== undefined) {
    for (let i: number = 0; i < typescriptMetadataList.length; ++i) {
      if (constructorArgumentsMetadata[i] === undefined) {
        const typescriptMetadata: Newable = typescriptMetadataList[
          i
        ] as Newable;

        constructorArgumentsMetadata[i] =
          getClassElementMetadataFromNewable(typescriptMetadata);
      }
    }
  }

  return constructorArgumentsMetadata;
}
