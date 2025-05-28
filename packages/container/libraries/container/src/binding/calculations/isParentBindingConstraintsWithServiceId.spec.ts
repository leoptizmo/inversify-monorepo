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
vitest.mock('./isParentBindingConstraints');

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
    let isBindingConstraintsWithNameResultMock: Mock<
      (constraints: BindingConstraints) => boolean
    >;
    let isParentBindingConstraintsResultMock: Mock<
      (constraints: BindingConstraints) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingConstraintsWithNameResultMock = vitest.fn();
      isParentBindingConstraintsResultMock = vitest.fn();

      vitest
        .mocked(isBindingConstraintsWithServiceId)
        .mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      vitest
        .mocked(isParentBindingConstraints)
        .mockReturnValueOnce(isParentBindingConstraintsResultMock);

      result = isParentBindingConstraintsWithServiceId(serviceIdFixture);
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
