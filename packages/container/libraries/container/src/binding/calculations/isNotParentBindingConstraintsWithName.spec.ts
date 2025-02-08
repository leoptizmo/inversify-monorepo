import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingConstraints, MetadataName } from '@inversifyjs/core';

jest.mock('./isBindingConstraintsWithName');
jest.mock('./isNotParentBindingConstraints');

import { isBindingConstraintsWithName } from './isBindingConstraintsWithName';
import { isNotParentBindingConstraints } from './isNotParentBindingConstraints';
import { isNotParentBindingConstraintsWithName } from './isNotParentBindingConstraintsWithName';

describe(isNotParentBindingConstraintsWithName.name, () => {
  let nameFixture: MetadataName;

  beforeAll(() => {
    nameFixture = 'name-fixture';
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
        isBindingConstraintsWithName as jest.Mock<
          typeof isBindingConstraintsWithName
        >
      ).mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      (
        isNotParentBindingConstraints as jest.Mock<
          typeof isNotParentBindingConstraints
        >
      ).mockReturnValueOnce(isNotParentBindingConstraintsResultMock);

      result = isNotParentBindingConstraintsWithName(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingConstraintsWithName()', () => {
      expect(isBindingConstraintsWithName).toHaveBeenCalledTimes(1);
      expect(isBindingConstraintsWithName).toHaveBeenCalledWith(nameFixture);
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
