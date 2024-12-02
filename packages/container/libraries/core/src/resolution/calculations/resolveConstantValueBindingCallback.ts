import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';

export function resolveConstantValueBindingCallback(): never {
  throw new InversifyCoreError(
    InversifyCoreErrorKind.unknown,
    'Expected constant value binding with value, none found',
  );
}
