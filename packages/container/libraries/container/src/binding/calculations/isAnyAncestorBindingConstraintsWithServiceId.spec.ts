import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mock,
  vitest,
} from 'vitest';

import { BindingConstraints } from '@gritcode/inversifyjs-core';

vitest.mock('./isBindingConstraintsWithServiceId');
vitest.mock('./isAnyAncestorBindingConstraints');

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
    let isBindingConstraintsWithNameResultMock: Mock<
      (constraints: BindingConstraints) => boolean
    >;
    let isAnyAncestorBindingConstraintsResultMock: Mock<
      (constraints: BindingConstraints) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingConstraintsWithNameResultMock = vitest.fn();
      isAnyAncestorBindingConstraintsResultMock = vitest.fn();

      vitest
        .mocked(isBindingConstraintsWithServiceId)
        .mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      vitest
        .mocked(isAnyAncestorBindingConstraints)
        .mockReturnValueOnce(isAnyAncestorBindingConstraintsResultMock);

      result = isAnyAncestorBindingConstraintsWithServiceId(serviceIdFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
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
