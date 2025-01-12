import { updateOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { updateMaybeClassMetadataConstructorArgument } from '../actions/updateMaybeClassMetadataConstructorArgument';
import { updateMaybeClassMetadataProperty } from '../actions/updateMaybeClassMetadataProperty';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';

export function injectBase(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata,
  updatePendingClassMetadataCount: (
    target: object,
  ) => (metadata: MaybeClassElementMetadata | undefined) => void,
): ParameterDecorator & PropertyDecorator {
  const decorator: ParameterDecorator & PropertyDecorator = (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ): void => {
    if (parameterIndex === undefined) {
      injectProperty(updateMetadata, updatePendingClassMetadataCount)(
        target,
        propertyKey as string | symbol,
      );
    } else {
      injectParameter(updateMetadata, updatePendingClassMetadataCount)(
        target,
        propertyKey,
        parameterIndex,
      );
    }
  };

  return decorator;
}

function buildComposedUpdateMetadata(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata,
  updatePendingClassMetadataCount: (
    target: object,
  ) => (metadata: MaybeClassElementMetadata | undefined) => void,
): (
  target: object,
) => (
  metadata: MaybeClassElementMetadata | undefined,
) => MaybeClassElementMetadata {
  return (
    target: object,
  ): ((
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata) => {
    const updateTargetPendingClassMetadataCount: (
      metadata: MaybeClassElementMetadata | undefined,
    ) => void = updatePendingClassMetadataCount(target);

    return (
      metadata: MaybeClassElementMetadata | undefined,
    ): MaybeClassElementMetadata => {
      updateTargetPendingClassMetadataCount(metadata);

      return updateMetadata(metadata);
    };
  };
}

function injectParameter(
  updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata,
  updatePendingClassMetadataCount: (
    target: object,
  ) => (metadata: MaybeClassElementMetadata | undefined) => void,
): ParameterDecorator {
  const buildComposedUpdateMetadataFromTarget: (
    target: object,
  ) => (
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata = buildComposedUpdateMetadata(
    updateMetadata,
    updatePendingClassMetadataCount,
  );

  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ): void => {
    if (isConstructorParameter(target, propertyKey)) {
      updateOwnReflectMetadata(
        target,
        classMetadataReflectKey,
        getDefaultClassMetadata,
        updateMaybeClassMetadataConstructorArgument(
          buildComposedUpdateMetadataFromTarget(target),
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
  updatePendingClassMetadataCount: (
    target: object,
  ) => (metadata: MaybeClassElementMetadata | undefined) => void,
): PropertyDecorator {
  const buildComposedUpdateMetadataFromTarget: (
    target: object,
  ) => (
    metadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata = buildComposedUpdateMetadata(
    updateMetadata,
    updatePendingClassMetadataCount,
  );

  return (target: object, propertyKey: string | symbol): void => {
    updateOwnReflectMetadata(
      target.constructor,
      classMetadataReflectKey,
      getDefaultClassMetadata,
      updateMaybeClassMetadataProperty(
        buildComposedUpdateMetadataFromTarget(target),
        propertyKey,
      ),
    );
  };
}

function isConstructorParameter(
  target: unknown,
  propertyKey: string | symbol | undefined,
): boolean {
  return typeof target === 'function' && propertyKey === undefined;
}
