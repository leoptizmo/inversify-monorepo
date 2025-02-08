import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingConstraints, MetadataName } from '@inversifyjs/core';

jest.mock('./isBindingConstraintsWithName');
jest.mock('./isParentBindingConstraints');

import { isBindingConstraintsWithName } from './isBindingConstraintsWithName';
import { isParentBindingConstraints } from './isParentBindingConstraints';
import { isParentBindingConstraintsWithName } from './isParentBindingConstraintsWithName';

describe(isParentBindingConstraintsWithName.name, () => {
  let nameFixture: MetadataName;

  beforeAll(() => {
    nameFixture = 'name-fixture';
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
        isBindingConstraintsWithName as jest.Mock<
          typeof isBindingConstraintsWithName
        >
      ).mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      (
        isParentBindingConstraints as jest.Mock<
          typeof isParentBindingConstraints
        >
      ).mockReturnValueOnce(isParentBindingConstraintsResultMock);

      result = isParentBindingConstraintsWithName(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingConstraintsWithName()', () => {
      expect(isBindingConstraintsWithName).toHaveBeenCalledTimes(1);
      expect(isBindingConstraintsWithName).toHaveBeenCalledWith(nameFixture);
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
