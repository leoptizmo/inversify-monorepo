import { Newable } from '@inversifyjs/common';

import { ClassMetadata } from '../models/ClassMetadata';
import { getClassMetadataConstructorArguments } from './getClassMetadataConstructorArguments';
import { getClassMetadataProperties } from './getClassMetadataProperties';

export function getClassMetadata<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
): ClassMetadata {
  const classMetadata: ClassMetadata = {
    constructorArguments: getClassMetadataConstructorArguments(type),
    properties: getClassMetadataProperties(type),
  };

  return classMetadata;
}
