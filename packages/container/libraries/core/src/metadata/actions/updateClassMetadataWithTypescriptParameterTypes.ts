import { Newable } from '@inversifyjs/common';
import {
  getOwnReflectMetadata,
  updateOwnReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { typescriptParameterTypesReflectKey } from '../../reflectMetadata/data/typescriptDesignParameterTypesReflectKey';
import { buildClassElementMetadataFromTypescriptParameterType } from '../calculations/buildClassElementMetadataFromTypescriptParameterType';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { isUserlandEmittedType } from '../calculations/isUserlandEmittedType';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';

export function updateClassMetadataWithTypescriptParameterTypes(
  target: object,
): void {
  const typescriptConstructorArguments: Newable[] | undefined =
    getOwnReflectMetadata(target, typescriptParameterTypesReflectKey);

  if (typescriptConstructorArguments !== undefined) {
    updateOwnReflectMetadata(
      target,
      classMetadataReflectKey,
      getDefaultClassMetadata,
      updateMaybeClassMetadataWithTypescriptClassMetadata(
        typescriptConstructorArguments,
      ),
    );
  }
}

function updateMaybeClassMetadataWithTypescriptClassMetadata(
  typescriptConstructorArguments: Newable[],
): (classMetadata: MaybeClassMetadata) => MaybeClassMetadata {
  return (classMetadata: MaybeClassMetadata): MaybeClassMetadata => {
    typescriptConstructorArguments.forEach(
      (constructorArgumentType: Newable, index: number): void => {
        if (
          classMetadata.constructorArguments[index] === undefined &&
          isUserlandEmittedType(constructorArgumentType)
        ) {
          classMetadata.constructorArguments[index] =
            buildClassElementMetadataFromTypescriptParameterType(
              constructorArgumentType,
            );
        }
      },
    );

    return classMetadata;
  };
}
