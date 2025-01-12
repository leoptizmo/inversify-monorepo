import { updateOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { pendingClassMetadataCountReflectKey } from '../../reflectMetadata/data/pendingClassMetadataCountReflectKey';
import { getDefaultPendingClassMetadataCount } from '../calculations/getDefaultPendingClassMetadataCount';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';

export function decrementPendingClassMetadataCount(
  type: object,
): (metadata: MaybeClassElementMetadata | undefined) => void {
  return (metadata: MaybeClassElementMetadata | undefined): void => {
    if (
      metadata !== undefined &&
      metadata.kind === MaybeClassElementMetadataKind.unknown
    ) {
      updateOwnReflectMetadata(
        type,
        pendingClassMetadataCountReflectKey,
        getDefaultPendingClassMetadataCount,
        (count: number) => count - 1,
      );
    }
  };
}
