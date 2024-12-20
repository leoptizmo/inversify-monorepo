import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/prototype-utils');

import { Newable } from '@inversifyjs/common';
import { getBaseType } from '@inversifyjs/prototype-utils';

jest.mock('./injectFrom');

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { InjectFromBaseOptions } from '../models/InjectFromBaseOptions';
import { InjectFromOptions } from '../models/InjectFromOptions';
import { injectFrom } from './injectFrom';
import { injectFromBase } from './injectFromBase';

describe(injectFromBase.name, () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  let targetFixture: Function;

  beforeAll(() => {
    targetFixture = class {};
  });

  describe('when called, and getBaseType returns Newable', () => {
    let injectFromBaseOptionsFixture: InjectFromBaseOptions;

    let baseTypefixture: Newable;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    let injectFromResultMock: jest.Mock<(target: Function) => void>;

    let result: unknown;

    beforeAll(() => {
      injectFromBaseOptionsFixture = {
        extendConstructorArguments: true,
        extendProperties: true,
      };
      baseTypefixture = class Base {};
      injectFromResultMock = jest.fn().mockReturnValueOnce(undefined);

      (getBaseType as jest.Mock<typeof getBaseType>).mockReturnValueOnce(
        baseTypefixture,
      );

      (injectFrom as jest.Mock<typeof injectFrom>).mockReturnValueOnce(
        injectFromResultMock,
      );

      result = injectFromBase(injectFromBaseOptionsFixture)(targetFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBaseType()', () => {
      expect(getBaseType).toHaveBeenCalledTimes(1);
      expect(getBaseType).toHaveBeenCalledWith(targetFixture);
    });

    it('should call injectFrom()', () => {
      const expected: InjectFromOptions = {
        ...injectFromBaseOptionsFixture,
        type: baseTypefixture,
      };

      expect(injectFrom).toHaveBeenCalledTimes(1);
      expect(injectFrom).toHaveBeenCalledWith(expected);

      expect(injectFromResultMock).toHaveBeenCalledTimes(1);
      expect(injectFromResultMock).toHaveBeenCalledWith(targetFixture);
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and getBaseType returns undefined', () => {
    let injectFromBaseOptionsFixture: InjectFromBaseOptions;

    let result: unknown;

    beforeAll(() => {
      injectFromBaseOptionsFixture = {
        extendConstructorArguments: true,
        extendProperties: true,
      };

      (getBaseType as jest.Mock<typeof getBaseType>).mockReturnValueOnce(
        undefined,
      );

      try {
        injectFromBase(injectFromBaseOptionsFixture)(targetFixture);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBaseType()', () => {
      expect(getBaseType).toHaveBeenCalledTimes(1);
      expect(getBaseType).toHaveBeenCalledWith(targetFixture);
    });

    it('should return undefined', () => {
      const expectedErrorProperties: Partial<InversifyCoreError> = {
        kind: InversifyCoreErrorKind.injectionDecoratorConflict,
        message: `Expected base type for type "${targetFixture.name}", none found.`,
      };

      expect(result).toBeInstanceOf(InversifyCoreError);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedErrorProperties),
      );
    });
  });
});
