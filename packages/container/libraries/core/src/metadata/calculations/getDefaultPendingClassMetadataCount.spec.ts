import { beforeAll, describe, expect, it } from '@jest/globals';

import { getDefaultPendingClassMetadataCount } from './getDefaultPendingClassMetadataCount';

describe(getDefaultPendingClassMetadataCount.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = getDefaultPendingClassMetadataCount();
    });

    it('should return expected value', () => {
      expect(result).toBe(0);
    });
  });
});
