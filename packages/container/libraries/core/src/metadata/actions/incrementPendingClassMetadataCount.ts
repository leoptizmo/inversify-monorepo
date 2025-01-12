import { updateOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { pendingClassMetadataCountReflectKey } from '../../reflectMetadata/data/pendingClassMetadataCountReflectKey';
import { getDefaultPendingClassMetadataCount } from '../calculations/getDefaultPendingClassMetadataCount';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';

export function incrementPendingClassMetadataCount(
  type: object,
): (metadata: MaybeClassElementMetadata | undefined) => void {
  return (metadata: MaybeClassElementMetadata | undefined): void => {
    if (metadata === undefined) {
      updateOwnReflectMetadata(
        type,
        pendingClassMetadataCountReflectKey,
        getDefaultPendingClassMetadataCount,
        (count: number) => count + 1,
      );
    }
  };
}
