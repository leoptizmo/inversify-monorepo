import { beforeAll, describe, expect, it } from '@jest/globals';

import { buildDefaultBindingMetadataMap } from './buildDefaultBindingMetadataMap';

describe(buildDefaultBindingMetadataMap.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = buildDefaultBindingMetadataMap();
    });

    it('should return a Map', () => {
      expect(result).toStrictEqual(new Map());
    });
  });
});
