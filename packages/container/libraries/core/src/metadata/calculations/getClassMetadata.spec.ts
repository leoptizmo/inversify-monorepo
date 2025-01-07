import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./getDefaultClassMetadata');

jest.mock('@inversifyjs/reflect-metadata-utils');

import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

jest.mock('./getDefaultClassMetadata');
jest.mock('./isPendingClassMetadata');
jest.mock('./throwAtInvalidClassMetadata');
jest.mock('./validateConstructorMetadataArray');

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { ClassMetadataFixtures } from '../fixtures/ClassMetadataFixtures';
import { ClassMetadata } from '../models/ClassMetadata';
import { getClassMetadata } from './getClassMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';
import { isPendingClassMetadata } from './isPendingClassMetadata';
import { throwAtInvalidClassMetadata } from './throwAtInvalidClassMetadata';
import { validateConstructorMetadataArray } from './validateConstructorMetadataArray';

describe(getClassMetadata.name, () => {
  let typeFixture: Newable;

  beforeAll(() => {
    typeFixture = class Foo {};
  });

  describe('when called, and getReflectMetadata() returns ClassMetadata and isPendingClassMetadata() returns true', () => {
    let errorFixture: Error;
    let metadataFixture: ClassMetadata;

    let result: unknown;

    beforeAll(() => {
      errorFixture = new Error('error-fixture-message');
      metadataFixture = ClassMetadataFixtures.any;

      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(metadataFixture);

      (
        isPendingClassMetadata as jest.Mock<typeof isPendingClassMetadata>
      ).mockReturnValueOnce(true);

      (
        throwAtInvalidClassMetadata as jest.Mock<
          typeof throwAtInvalidClassMetadata
        >
      ).mockImplementationOnce((): never => {
        throw errorFixture;
      });

      try {
        getClassMetadata(typeFixture);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        typeFixture,
        classMetadataReflectKey,
      );
    });

    it('should not call getDefaultClassMetadata()', () => {
      expect(getDefaultClassMetadata).not.toHaveBeenCalled();
    });

    it('should call throwAtInvalidClassMetadata()', () => {
      expect(throwAtInvalidClassMetadata).toHaveBeenCalledTimes(1);
      expect(throwAtInvalidClassMetadata).toHaveBeenCalledWith(
        typeFixture,
        metadataFixture,
      );
    });

    it('should throw expected Error', () => {
      expect(result).toBe(errorFixture);
    });
  });

  describe('when called, and getReflectMetadata() returns undefined, and isPendingClassMetadata() returns false', () => {
    let metadataFixture: ClassMetadata;

    let result: unknown;

    beforeAll(() => {
      metadataFixture = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map(),
        scope: undefined,
      };

      (
        getDefaultClassMetadata as jest.Mock<typeof getDefaultClassMetadata>
      ).mockReturnValueOnce(metadataFixture);

      (
        isPendingClassMetadata as jest.Mock<typeof isPendingClassMetadata>
      ).mockReturnValueOnce(false);

      result = getClassMetadata(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        typeFixture,
        classMetadataReflectKey,
      );
    });

    it('should call getDefaultClassMetadata()', () => {
      expect(getDefaultClassMetadata).toHaveBeenCalledTimes(1);
      expect(getDefaultClassMetadata).toHaveBeenCalledWith();
    });

    it('should call validateConstructorMetadataArray()', () => {
      expect(validateConstructorMetadataArray).toHaveBeenCalledTimes(1);
      expect(validateConstructorMetadataArray).toHaveBeenCalledWith(
        typeFixture,
        metadataFixture.constructorArguments,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(metadataFixture);
    });
  });
});
