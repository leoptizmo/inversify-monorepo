import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { ClassMetadata } from '../models/ClassMetadata';
import { assertConstructorMetadataArrayFilled } from './assertConstructorMetadataArrayFilled';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';
import { isPendingClassMetadata } from './isPendingClassMetadata';
import { throwAtInvalidClassMetadata } from './throwAtInvalidClassMetadata';

export function getClassMetadata(type: Newable): ClassMetadata {
  const classMetadata: ClassMetadata =
    getReflectMetadata(type, classMetadataReflectKey) ??
    getDefaultClassMetadata();

  if (isPendingClassMetadata(type)) {
    throwAtInvalidClassMetadata(type, classMetadata);
  } else {
    assertConstructorMetadataArrayFilled(
      type,
      classMetadata.constructorArguments,
    );

    return classMetadata;
  }
}
