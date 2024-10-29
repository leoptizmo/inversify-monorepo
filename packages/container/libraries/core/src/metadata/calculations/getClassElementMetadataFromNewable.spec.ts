import { beforeAll, describe, expect, it } from '@jest/globals';

import { Newable } from '@inversifyjs/common';

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { getClassElementMetadataFromNewable } from './getClassElementMetadataFromNewable';

describe(getClassElementMetadataFromNewable.name, () => {
  describe('when called', () => {
    let typeFixture: Newable;

    let result: unknown;

    beforeAll(() => {
      typeFixture = class {};

      result = getClassElementMetadataFromNewable(typeFixture);
    });

    it('should return ClassElementMetadata', () => {
      const expected: ClassElementMetadata = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: typeFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
