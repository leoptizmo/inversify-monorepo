import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mock,
  Mocked,
  vitest,
} from 'vitest';

import { BindingConstraints } from '@gritcode/inversifyjs-core';

import { isNotParentBindingConstraints } from './isNotParentBindingConstraints';

describe(isNotParentBindingConstraints.name, () => {
  let conditionMock: Mock<(constraints: BindingConstraints) => boolean>;
  let constraintsMock: Mocked<BindingConstraints>;

  beforeAll(() => {
    conditionMock = vitest.fn();
    constraintsMock = {
      getAncestor: vitest.fn(),
    } as Partial<Mocked<BindingConstraints>> as Mocked<BindingConstraints>;
  });

  describe('when called, and constraints.getAncestor() returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      constraintsMock.getAncestor.mockReturnValueOnce(undefined);

      result = isNotParentBindingConstraints(conditionMock)(constraintsMock);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call constraints.getAncestor()', () => {
      expect(constraintsMock.getAncestor).toHaveBeenCalledTimes(1);
      expect(constraintsMock.getAncestor).toHaveBeenCalledWith();
    });

    it('should not call constraint()', () => {
      expect(conditionMock).not.toHaveBeenCalled();
    });

    it('should return true', () => {
      expect(result).toBe(true);
    });
  });

  describe('when called, and constraints.getAncestor() returns BindingConstraints', () => {
    let constraintResultFixture: boolean;

    let result: unknown;

    beforeAll(() => {
      constraintResultFixture = true;

      constraintsMock.getAncestor.mockReturnValueOnce(constraintsMock);

      conditionMock.mockReturnValueOnce(constraintResultFixture);

      result = isNotParentBindingConstraints(conditionMock)(constraintsMock);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call constraints.getAncestor()', () => {
      expect(constraintsMock.getAncestor).toHaveBeenCalledTimes(1);
      expect(constraintsMock.getAncestor).toHaveBeenCalledWith();
    });

    it('should call condition()', () => {
      expect(conditionMock).toHaveBeenCalledTimes(1);
      expect(conditionMock).toHaveBeenCalledWith(constraintsMock);
    });

    it('should return expected result', () => {
      expect(result).toBe(!constraintResultFixture);
    });
  });
});
