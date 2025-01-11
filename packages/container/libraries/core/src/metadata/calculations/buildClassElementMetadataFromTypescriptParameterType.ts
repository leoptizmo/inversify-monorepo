import { Newable } from '@inversifyjs/common';

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';

export function buildClassElementMetadataFromTypescriptParameterType(
  type: Newable,
): ClassElementMetadata {
  return {
    isFromTypescriptParamType: true,
    kind: ClassElementMetadataKind.singleInjection,
    name: undefined,
    optional: false,
    tags: new Map(),
    value: type,
  };
}
