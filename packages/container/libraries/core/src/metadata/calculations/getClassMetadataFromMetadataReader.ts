import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { POST_CONSTRUCT, PRE_DESTROY } from '../../reflectMetadata/data/keys';
import { ClassMetadata } from '../models/ClassMetadata';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { LegacyMetadataReader } from '../models/LegacyMetadataReader';
import { getClassMetadataConstructorArgumentsFromMetadataReader } from './getClassMetadataConstructorArgumentsFromMetadataReader';
import { getClassMetadataPropertiesFromMetadataReader } from './getClassMetadataPropertiesFromMetadataReader';

export function getClassMetadataFromMetadataReader(
  type: Newable,
  metadataReader: LegacyMetadataReader,
): ClassMetadata {
  const postConstructMetadata: LegacyMetadata | undefined =
    getReflectMetadata<LegacyMetadata>(type, POST_CONSTRUCT);
  const preDestroyMetadata: LegacyMetadata | undefined =
    getReflectMetadata<LegacyMetadata>(type, PRE_DESTROY);

  const classMetadata: ClassMetadata = {
    constructorArguments:
      getClassMetadataConstructorArgumentsFromMetadataReader(
        type,
        metadataReader,
      ),
    lifecycle: {
      postConstructMethodName: postConstructMetadata?.value as string,
      preDestroyMethodName: preDestroyMetadata?.value as string,
    },
    properties: getClassMetadataPropertiesFromMetadataReader(
      type,
      metadataReader,
    ),
  };

  return classMetadata;
}
