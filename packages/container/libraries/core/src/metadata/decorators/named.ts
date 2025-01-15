import { incrementPendingClassMetadataCount } from '../actions/incrementPendingClassMetadataCount';
import { updateMetadataName } from '../actions/updateMetadataName';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { MetadataName } from '../models/MetadataName';
import { injectBase } from './injectBase';

export function named(
  name: MetadataName,
): MethodDecorator & ParameterDecorator & PropertyDecorator {
  const updateMetadata: (
    metadata: MaybeClassElementMetadata | undefined,
  ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata =
    buildMaybeClassElementMetadataFromMaybeClassElementMetadata(
      updateMetadataName(name),
    );

  return injectBase(updateMetadata, incrementPendingClassMetadataCount);
}
