import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { buildClassElementMetadataFromMaybeClassElementMetadata } from './buildClassElementMetadataFromMaybeClassElementMetadata';
import { buildDefaultManagedMetadata } from './buildDefaultManagedMetadata';
import { buildManagedMetadataFromMaybeManagedMetadata } from './buildManagedMetadataFromMaybeManagedMetadata';

export const buildManagedMetadataFromMaybeClassElementMetadata: (
  kind:
    | ClassElementMetadataKind.multipleInjection
    | ClassElementMetadataKind.singleInjection,
  serviceIdentifier: ServiceIdentifier | LazyServiceIdentifier,
) => (metadata: MaybeClassElementMetadata | undefined) => ClassElementMetadata =
  buildClassElementMetadataFromMaybeClassElementMetadata(
    buildDefaultManagedMetadata,
    buildManagedMetadataFromMaybeManagedMetadata,
  );
