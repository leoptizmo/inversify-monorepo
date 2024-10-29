import { Newable } from '@inversifyjs/common';

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';

export function getClassElementMetadataFromNewable(
  type: Newable,
): ClassElementMetadata {
  return {
    kind: ClassElementMetadataKind.singleInjection,
    name: undefined,
    optional: false,
    tags: new Map(),
    targetName: undefined,
    value: type,
  };
}
