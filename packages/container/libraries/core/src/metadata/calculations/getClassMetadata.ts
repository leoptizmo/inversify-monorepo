import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { POST_CONSTRUCT, PRE_DESTROY } from '../../reflectMetadata/data/keys';
import { ClassMetadata } from '../models/ClassMetadata';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { getClassMetadataConstructorArguments } from './getClassMetadataConstructorArguments';
import { getClassMetadataProperties } from './getClassMetadataProperties';

export function getClassMetadata(type: Newable): ClassMetadata {
  const postConstructMetadata: LegacyMetadata | undefined =
    getReflectMetadata<LegacyMetadata>(type, POST_CONSTRUCT);
  const preDestroyMetadata: LegacyMetadata | undefined =
    getReflectMetadata<LegacyMetadata>(type, PRE_DESTROY);

  const classMetadata: ClassMetadata = {
    constructorArguments: getClassMetadataConstructorArguments(type),
    lifecycle: {
      postConstructMethodName: postConstructMetadata?.value as string,
      preDestroyMethodName: preDestroyMetadata?.value as string,
    },
    properties: getClassMetadataProperties(type),
  };

  return classMetadata;
}
