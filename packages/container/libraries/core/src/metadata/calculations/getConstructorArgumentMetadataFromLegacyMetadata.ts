import { Newable } from '@inversifyjs/common';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';

export function getConstructorArgumentMetadataFromLegacyMetadata(
  type: Newable,
  index: number,
  metadataList: LegacyMetadata[],
): ClassElementMetadata {
  try {
    return getClassElementMetadataFromLegacyMetadata(metadataList);
  } catch (error: unknown) {
    if (
      InversifyCoreError.isErrorOfKind(
        error,
        InversifyCoreErrorKind.missingInjectionDecorator,
      )
    ) {
      throw new InversifyCoreError(
        InversifyCoreErrorKind.missingInjectionDecorator,
        `Expected a single @inject, @multiInject or @unmanaged decorator at type "${type.name}" at constructor arguments at index "${index.toString()}"`,
        { cause: error },
      );
    } else {
      throw error;
    }
  }
}
