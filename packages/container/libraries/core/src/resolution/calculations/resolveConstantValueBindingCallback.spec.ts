import { beforeAll, describe, expect, it } from '@jest/globals';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { resolveConstantValueBindingCallback } from './resolveConstantValueBindingCallback';

describe(resolveConstantValueBindingCallback.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      try {
        resolveConstantValueBindingCallback();
      } catch (error: unknown) {
        result = error;
      }
    });

    it('should throw an InversifyCoreError', () => {
      const expectedErrorProperties: Partial<InversifyCoreError> = {
        kind: InversifyCoreErrorKind.unknown,
        message: 'Expected constant value binding with value, none found',
      };

      expect(result).toBeInstanceOf(InversifyCoreError);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedErrorProperties),
      );
    });
  });
});
