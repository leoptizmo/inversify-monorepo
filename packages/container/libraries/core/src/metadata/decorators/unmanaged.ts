import { decrementPendingClassMetadataCount } from '../actions/decrementPendingClassMetadataCount';
import { buildUnmanagedMetadataFromMaybeClassElementMetadata } from '../calculations/buildUnmanagedMetadataFromMaybeClassElementMetadata';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { injectBase } from './injectBase';

export function unmanaged(): MethodDecorator &
  ParameterDecorator &
  PropertyDecorator {
  const updateMetadata: (
    classElementMetadata: MaybeClassElementMetadata | undefined,
  ) => ClassElementMetadata =
    buildUnmanagedMetadataFromMaybeClassElementMetadata();

  return injectBase(updateMetadata, decrementPendingClassMetadataCount);
}
