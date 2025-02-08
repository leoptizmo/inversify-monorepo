import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingConstraints } from '@inversifyjs/core';

jest.mock('./isBindingConstraintsWithServiceId');
jest.mock('./isAnyAncestorBindingConstraints');

import { ServiceIdentifier } from '@inversifyjs/common';

import { isAnyAncestorBindingConstraints } from './isAnyAncestorBindingConstraints';
import { isAnyAncestorBindingConstraintsWithServiceId } from './isAnyAncestorBindingConstraintsWithServiceId';
import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';

describe(isAnyAncestorBindingConstraintsWithServiceId.name, () => {
  let serviceIdFixture: ServiceIdentifier;

  beforeAll(() => {
    serviceIdFixture = 'name-fixture';
  });

  describe('when called', () => {
    let isBindingConstraintsWithNameResultMock: jest.Mock<
      (constraints: BindingConstraints) => boolean
    >;
    let isAnyAncestorBindingConstraintsResultMock: jest.Mock<
      (constraints: BindingConstraints) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingConstraintsWithNameResultMock = jest.fn();
      isAnyAncestorBindingConstraintsResultMock = jest.fn();

      (
        isBindingConstraintsWithServiceId as jest.Mock<
          typeof isBindingConstraintsWithServiceId
        >
      ).mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      (
        isAnyAncestorBindingConstraints as jest.Mock<
          typeof isAnyAncestorBindingConstraints
        >
      ).mockReturnValueOnce(isAnyAncestorBindingConstraintsResultMock);

      result = isAnyAncestorBindingConstraintsWithServiceId(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingConstraintsWithServiceId()', () => {
      expect(isBindingConstraintsWithServiceId).toHaveBeenCalledTimes(1);
      expect(isBindingConstraintsWithServiceId).toHaveBeenCalledWith(
        serviceIdFixture,
      );
    });

    it('should call isAnyAncestorBindingConstraints()', () => {
      expect(isAnyAncestorBindingConstraints).toHaveBeenCalledTimes(1);
      expect(isAnyAncestorBindingConstraints).toHaveBeenCalledWith(
        isBindingConstraintsWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isAnyAncestorBindingConstraintsResultMock);
    });
  });
});
