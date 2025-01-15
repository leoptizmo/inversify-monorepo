import { incrementPendingClassMetadataCount } from '../actions/incrementPendingClassMetadataCount';
import { updateMetadataOptional } from '../actions/updateMetadataOptional';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { injectBase } from './injectBase';

export function optional(): MethodDecorator &
  ParameterDecorator &
  PropertyDecorator {
  const updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata =
    buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
      updateMetadataOptional,
    );

  return injectBase(updateMetadata, incrementPendingClassMetadataCount);
}
