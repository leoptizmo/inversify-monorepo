import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingConstraints, MetadataName } from '@inversifyjs/core';

jest.mock('./isBindingConstraintsWithName');
jest.mock('./isNoAncestorBindingConstraints');

import { isBindingConstraintsWithName } from './isBindingConstraintsWithName';
import { isNoAncestorBindingConstraints } from './isNoAncestorBindingConstraints';
import { isNoAncestorBindingConstraintsWithName } from './isNoAncestorBindingConstraintsWithName';

describe(isNoAncestorBindingConstraintsWithName.name, () => {
  let nameFixture: MetadataName;

  beforeAll(() => {
    nameFixture = 'name-fixture';
  });

  describe('when called', () => {
    let isBindingConstraintsWithNameResultMock: jest.Mock<
      (constraints: BindingConstraints) => boolean
    >;
    let isNoAncestorBindingConstraintsResultMock: jest.Mock<
      (constraints: BindingConstraints) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingConstraintsWithNameResultMock = jest.fn();
      isNoAncestorBindingConstraintsResultMock = jest.fn();

      (
        isBindingConstraintsWithName as jest.Mock<
          typeof isBindingConstraintsWithName
        >
      ).mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      (
        isNoAncestorBindingConstraints as jest.Mock<
          typeof isNoAncestorBindingConstraints
        >
      ).mockReturnValueOnce(isNoAncestorBindingConstraintsResultMock);

      result = isNoAncestorBindingConstraintsWithName(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingConstraintsWithName()', () => {
      expect(isBindingConstraintsWithName).toHaveBeenCalledTimes(1);
      expect(isBindingConstraintsWithName).toHaveBeenCalledWith(nameFixture);
    });

    it('should call isNoAncestorBindingConstraints()', () => {
      expect(isNoAncestorBindingConstraints).toHaveBeenCalledTimes(1);
      expect(isNoAncestorBindingConstraints).toHaveBeenCalledWith(
        isBindingConstraintsWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isNoAncestorBindingConstraintsResultMock);
    });
  });
});
