import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { ClassMetadata } from '../models/ClassMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';
import { isPendingClassMetadata } from './isPendingClassMetadata';
import { throwAtInvalidClassMetadata } from './throwAtInvalidClassMetadata';
import { validateConstructorMetadataArray } from './validateConstructorMetadataArray';

export function getClassMetadata(type: Newable): ClassMetadata {
  const classMetadata: ClassMetadata =
    getReflectMetadata(type, classMetadataReflectKey) ??
    getDefaultClassMetadata();

  if (isPendingClassMetadata(type)) {
    throwAtInvalidClassMetadata(type, classMetadata);
  } else {
    validateConstructorMetadataArray(type, classMetadata.constructorArguments);

    return classMetadata;
  }
}
