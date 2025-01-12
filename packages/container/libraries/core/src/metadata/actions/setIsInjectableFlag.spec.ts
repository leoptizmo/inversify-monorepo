import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { classIsInjectableFlagReflectKey } from '../../reflectMetadata/data/classIsInjectableFlagReflectKey';
import { setIsInjectableFlag } from './setIsInjectableFlag';

describe('setIsInjectableFlag', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  let targetFixture: Function;

  beforeAll(() => {
    targetFixture = class {};
  });

  describe('when called, and getReflectMetadata() returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      (getReflectMetadata as jest.Mock).mockReturnValueOnce(undefined);

      result = setIsInjectableFlag(targetFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        classIsInjectableFlagReflectKey,
      );
    });

    it('should call setReflectMetadata', () => {
      expect(setReflectMetadata).toHaveBeenCalledTimes(1);
      expect(setReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        classIsInjectableFlagReflectKey,
        true,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and getReflectMetadata() returns boolean', () => {
    let result: unknown;

    beforeAll(() => {
      (getReflectMetadata as jest.Mock).mockReturnValueOnce(true);

      try {
        setIsInjectableFlag(targetFixture);
      } catch (error) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should throw an InversifyCoreError', () => {
      const expectedErrorProperties: Partial<InversifyCoreError> = {
        kind: InversifyCoreErrorKind.injectionDecoratorConflict,
        message:
          'Cannot apply @injectable decorator multiple times at class "targetFixture"',
      };

      expect(result).toBeInstanceOf(InversifyCoreError);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedErrorProperties),
      );
    });
  });
});
