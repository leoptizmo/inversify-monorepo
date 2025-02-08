import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingConstraints, MetadataTag } from '@inversifyjs/core';

jest.mock('./isBindingConstraintsWithTag');
jest.mock('./isNotParentBindingConstraints');

import { isBindingConstraintsWithTag } from './isBindingConstraintsWithTag';
import { isNotParentBindingConstraints } from './isNotParentBindingConstraints';
import { isNotParentBindingConstraintsWithTag } from './isNotParentBindingConstraintsWithTag';

describe(isNotParentBindingConstraintsWithTag.name, () => {
  let tagFixture: MetadataTag;
  let tagValueFixture: unknown;

  beforeAll(() => {
    tagFixture = 'tag-fixture';
    tagValueFixture = Symbol();
  });

  describe('when called', () => {
    let isBindingConstraintsWithNameResultMock: jest.Mock<
      (constraints: BindingConstraints) => boolean
    >;
    let isNotParentBindingConstraintsResultMock: jest.Mock<
      (constraints: BindingConstraints) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingConstraintsWithNameResultMock = jest.fn();
      isNotParentBindingConstraintsResultMock = jest.fn();

      (
        isBindingConstraintsWithTag as jest.Mock<
          typeof isBindingConstraintsWithTag
        >
      ).mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      (
        isNotParentBindingConstraints as jest.Mock<
          typeof isNotParentBindingConstraints
        >
      ).mockReturnValueOnce(isNotParentBindingConstraintsResultMock);

      result = isNotParentBindingConstraintsWithTag(
        tagFixture,
        tagValueFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingConstraintsWithTag()', () => {
      expect(isBindingConstraintsWithTag).toHaveBeenCalledTimes(1);
      expect(isBindingConstraintsWithTag).toHaveBeenCalledWith(
        tagFixture,
        tagValueFixture,
      );
    });

    it('should call isNotParentBindingConstraints()', () => {
      expect(isNotParentBindingConstraints).toHaveBeenCalledTimes(1);
      expect(isNotParentBindingConstraints).toHaveBeenCalledWith(
        isBindingConstraintsWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isNotParentBindingConstraintsResultMock);
    });
  });
});
