import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { Newable } from '@inversifyjs/common';
import {
  getReflectMetadata,
  updateReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { typescriptParameterTypesReflectKey } from '../../reflectMetadata/data/typescriptDesignParameterTypesReflectKey';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { updateClassMetadataWithTypescriptParameterTypes } from './updateClassMetadataWithTypescriptParameterTypes';

describe(updateClassMetadataWithTypescriptParameterTypes.name, () => {
  describe('when called and getReflectMetadata() returns undefined', () => {
    let targetFixture: object;

    let result: unknown;

    beforeAll(() => {
      targetFixture = class {};

      result = updateClassMetadataWithTypescriptParameterTypes(targetFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        typescriptParameterTypesReflectKey,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called and getReflectMetadata() returns Newable[]', () => {
    let targetFixture: object;

    let newableListFixture: Newable[];

    let result: unknown;

    beforeAll(() => {
      targetFixture = class {};

      newableListFixture = [];

      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(newableListFixture);

      result = updateClassMetadataWithTypescriptParameterTypes(targetFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        typescriptParameterTypesReflectKey,
      );
    });

    it('should call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        classMetadataReflectKey,
        getDefaultClassMetadata,
        expect.any(Function),
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
