import { Newable } from '@inversifyjs/common';
import { getOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { ClassMetadata } from '../models/ClassMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';
import { isPendingClassMetadata } from './isPendingClassMetadata';
import { throwAtInvalidClassMetadata } from './throwAtInvalidClassMetadata';
import { validateConstructorMetadataArray } from './validateConstructorMetadataArray';

export function getClassMetadata(type: Newable): ClassMetadata {
  const classMetadata: ClassMetadata =
    getOwnReflectMetadata(type, classMetadataReflectKey) ??
    getDefaultClassMetadata();

  if (isPendingClassMetadata(type)) {
    throwAtInvalidClassMetadata(type, classMetadata);
  } else {
    validateConstructorMetadataArray(type, classMetadata.constructorArguments);

    return classMetadata;
  }
}
