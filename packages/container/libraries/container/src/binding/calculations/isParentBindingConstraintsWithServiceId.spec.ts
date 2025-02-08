import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingConstraints } from '@inversifyjs/core';

jest.mock('./isBindingConstraintsWithServiceId');
jest.mock('./isParentBindingConstraints');

import { ServiceIdentifier } from '@inversifyjs/common';

import { isBindingConstraintsWithServiceId } from './isBindingConstraintsWithServiceId';
import { isParentBindingConstraints } from './isParentBindingConstraints';
import { isParentBindingConstraintsWithServiceId } from './isParentBindingConstraintsWithServiceId';

describe(isParentBindingConstraintsWithServiceId.name, () => {
  let serviceIdFixture: ServiceIdentifier;

  beforeAll(() => {
    serviceIdFixture = 'name-fixture';
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
        isBindingConstraintsWithServiceId as jest.Mock<
          typeof isBindingConstraintsWithServiceId
        >
      ).mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      (
        isParentBindingConstraints as jest.Mock<
          typeof isParentBindingConstraints
        >
      ).mockReturnValueOnce(isParentBindingConstraintsResultMock);

      result = isParentBindingConstraintsWithServiceId(serviceIdFixture);
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
