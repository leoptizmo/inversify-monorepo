import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';

export function buildDefaultManagedMetadata(
  kind:
    | ClassElementMetadataKind.singleInjection
    | ClassElementMetadataKind.multipleInjection,
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier,
): ManagedClassElementMetadata {
  return {
    kind,
    name: undefined,
    optional: false,
    tags: new Map(),
    targetName: undefined,
    value: serviceIdentifier,
  };
}
