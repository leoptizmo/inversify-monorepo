import { updateOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { BindingScope } from '../../binding/models/BindingScope';
import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { setIsInjectableFlag } from '../actions/setIsInjectableFlag';
import { updateClassMetadataWithTypescriptParameterTypes } from '../actions/updateClassMetadataWithTypescriptParameterTypes';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';

export function injectable(scope?: BindingScope): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return (target: Function): void => {
    setIsInjectableFlag(target);

    updateClassMetadataWithTypescriptParameterTypes(target);

    if (scope !== undefined) {
      updateOwnReflectMetadata<MaybeClassMetadata>(
        target,
        classMetadataReflectKey,
        getDefaultClassMetadata,
        (metadata: MaybeClassMetadata) => ({
          ...metadata,
          scope,
        }),
      );
    }
  };
}
