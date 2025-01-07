import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';

export function assertMetadataFromTypescriptIfManaged(
  metadata: MaybeManagedClassElementMetadata | ManagedClassElementMetadata,
): void {
  if (
    metadata.kind !== MaybeClassElementMetadataKind.unknown &&
    metadata.isFromTypescriptParamType !== true
  ) {
    throw new InversifyCoreError(
      InversifyCoreErrorKind.injectionDecoratorConflict,
      'Unexpected injection found. Multiple @inject, @multiInject or @unmanaged decorators found',
    );
  }
}
