import { Newable } from '@inversifyjs/common';
import { getOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { pendingClassMetadataCountReflectKey } from '../../reflectMetadata/data/pendingClassMetadataCountReflectKey';

export function isPendingClassMetadata(type: Newable): boolean {
  const pendingClassMetadataCount: number | undefined = getOwnReflectMetadata(
    type,
    pendingClassMetadataCountReflectKey,
  );

  return (
    pendingClassMetadataCount !== undefined && pendingClassMetadataCount !== 0
  );
}
