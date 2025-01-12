import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { updateOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

jest.mock('../actions/updateMaybeClassMetadataPostConstructor');
jest.mock('../calculations/handleInjectionError');

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { updateMaybeClassMetadataPostConstructor } from '../actions/updateMaybeClassMetadataPostConstructor';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';
import { postConstruct } from './postConstruct';

describe(postConstruct.name, () => {
  let targetFixture: object;
  let propertyKeyFixture: string | symbol;
  let descriptorFixture: TypedPropertyDescriptor<unknown>;

  beforeAll(() => {
    targetFixture = class Foo {}.prototype;
    propertyKeyFixture = Symbol();
    descriptorFixture = {};
  });

  describe('when caled', () => {
    let updateMaybeClassMetadataPostConstructorResult: jest.Mock<
      (metadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      updateMaybeClassMetadataPostConstructorResult = jest.fn();

      (
        updateMaybeClassMetadataPostConstructor as jest.Mock<
          typeof updateMaybeClassMetadataPostConstructor
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataPostConstructorResult);

      result = postConstruct()(
        targetFixture,
        propertyKeyFixture,
        descriptorFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateMaybeClassMetadataPostConstructor()', () => {
      expect(updateMaybeClassMetadataPostConstructor).toHaveBeenCalledTimes(1);
      expect(updateMaybeClassMetadataPostConstructor).toHaveBeenCalledWith(
        propertyKeyFixture,
      );
    });

    it('should call updateOwnReflectMetadata()', () => {
      expect(updateOwnReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateOwnReflectMetadata).toHaveBeenCalledWith(
        targetFixture.constructor,
        classMetadataReflectKey,
        getDefaultClassMetadata,
        updateMaybeClassMetadataPostConstructorResult,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when caled, and updateOwnReflectMetadata throws an Error', () => {
    let errorFixture: Error;

    let updateMaybeClassMetadataPostConstructorResult: jest.Mock<
      (metadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      errorFixture = new Error('error-fixture');

      updateMaybeClassMetadataPostConstructorResult = jest.fn();

      (
        updateMaybeClassMetadataPostConstructor as jest.Mock<
          typeof updateMaybeClassMetadataPostConstructor
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataPostConstructorResult);

      (
        updateOwnReflectMetadata as jest.Mock<typeof updateOwnReflectMetadata>
      ).mockImplementation((): never => {
        throw errorFixture;
      });

      result = postConstruct()(
        targetFixture,
        propertyKeyFixture,
        descriptorFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateMaybeClassMetadataPostConstructor()', () => {
      expect(updateMaybeClassMetadataPostConstructor).toHaveBeenCalledTimes(1);
      expect(updateMaybeClassMetadataPostConstructor).toHaveBeenCalledWith(
        propertyKeyFixture,
      );
    });

    it('should call updateOwnReflectMetadata()', () => {
      expect(updateOwnReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateOwnReflectMetadata).toHaveBeenCalledWith(
        targetFixture.constructor,
        classMetadataReflectKey,
        getDefaultClassMetadata,
        updateMaybeClassMetadataPostConstructorResult,
      );
    });

    it('should call handleInjectionError', () => {
      expect(handleInjectionError).toHaveBeenCalledTimes(1);
      expect(handleInjectionError).toHaveBeenCalledWith(
        targetFixture,
        propertyKeyFixture,
        undefined,
        errorFixture,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
