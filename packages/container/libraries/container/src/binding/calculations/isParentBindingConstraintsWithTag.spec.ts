import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingConstraints, MetadataTag } from '@inversifyjs/core';

jest.mock('./isBindingConstraintsWithTag');
jest.mock('./isParentBindingConstraints');

import { isBindingConstraintsWithTag } from './isBindingConstraintsWithTag';
import { isParentBindingConstraints } from './isParentBindingConstraints';
import { isParentBindingConstraintsWithTag } from './isParentBindingConstraintsWithTag';

describe(isParentBindingConstraintsWithTag.name, () => {
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
    let isParentBindingConstraintsResultMock: jest.Mock<
      (constraints: BindingConstraints) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingConstraintsWithNameResultMock = jest.fn();
      isParentBindingConstraintsResultMock = jest.fn();

      (
        isBindingConstraintsWithTag as jest.Mock<
          typeof isBindingConstraintsWithTag
        >
      ).mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      (
        isParentBindingConstraints as jest.Mock<
          typeof isParentBindingConstraints
        >
      ).mockReturnValueOnce(isParentBindingConstraintsResultMock);

      result = isParentBindingConstraintsWithTag(tagFixture, tagValueFixture);
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

    it('should call isParentBindingConstraints()', () => {
      expect(isParentBindingConstraints).toHaveBeenCalledTimes(1);
      expect(isParentBindingConstraints).toHaveBeenCalledWith(
        isBindingConstraintsWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isParentBindingConstraintsResultMock);
    });
  });
});
