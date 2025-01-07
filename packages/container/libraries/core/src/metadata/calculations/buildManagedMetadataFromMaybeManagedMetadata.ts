import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { assertMetadataFromTypescriptIfManaged } from './assertMetadataFromTypescriptIfManaged';

export function buildManagedMetadataFromMaybeManagedMetadata(
  metadata: MaybeManagedClassElementMetadata | ManagedClassElementMetadata,
  kind:
    | ClassElementMetadataKind.singleInjection
    | ClassElementMetadataKind.multipleInjection,
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier,
): ManagedClassElementMetadata {
  assertMetadataFromTypescriptIfManaged(metadata);

  return {
    ...metadata,
    kind,
    value: serviceIdentifier,
  };
}
