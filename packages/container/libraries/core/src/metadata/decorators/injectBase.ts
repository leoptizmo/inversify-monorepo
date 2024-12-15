import { updateReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { updateMaybeClassMetadataConstructorArgument } from '../actions/updateMaybeClassMetadataConstructorArgument';
import { updateMaybeClassMetadataProperty } from '../actions/updateMaybeClassMetadataProperty';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';

export function injectBase(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata,
): ParameterDecorator & PropertyDecorator {
  const decorator: ParameterDecorator & PropertyDecorator = (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ): void => {
    if (parameterIndex === undefined) {
      injectProperty(updateMetadata)(target, propertyKey as string | symbol);
    } else {
      injectParameter(updateMetadata)(target, propertyKey, parameterIndex);
    }
  };

  return decorator;
}

function injectParameter(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata,
): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ): void => {
    if (isConstructorParameter(target, propertyKey)) {
      updateReflectMetadata(
        target,
        classMetadataReflectKey,
        getDefaultClassMetadata,
        updateMaybeClassMetadataConstructorArgument(
          updateMetadata,
          parameterIndex,
        ),
      );
    } else {
      throw new Error(
        `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "${
          propertyKey?.toString() ?? ''
        }" at class "${target.constructor.name}"`,
      );
    }
  };
}

function injectProperty(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    updateReflectMetadata(
      target.constructor,
      classMetadataReflectKey,
      getDefaultClassMetadata,
      updateMaybeClassMetadataProperty(updateMetadata, propertyKey),
    );
  };
}

function isConstructorParameter(
  target: unknown,
  propertyKey: string | symbol | undefined,
): boolean {
  return typeof target === 'function' && propertyKey === undefined;
}
