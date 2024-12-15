import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { pendingClassMetadataCountReflectKey } from '../../reflectMetadata/data/pendingClassMetadataCountReflectKey';

export function isPendingClassMetadata(type: Newable): boolean {
  const pendingClassMetadataCount: number | undefined = getReflectMetadata(
    type,
    pendingClassMetadataCountReflectKey,
  );

  return (
    pendingClassMetadataCount !== undefined && pendingClassMetadataCount !== 0
  );
}
