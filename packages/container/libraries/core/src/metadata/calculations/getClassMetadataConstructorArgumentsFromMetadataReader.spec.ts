import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { Newable } from '@inversifyjs/common';

jest.mock('./getClassElementMetadataFromLegacyMetadata');
jest.mock('./getClassElementMetadataFromNewable');

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { LegacyMetadataMap } from '../models/LegacyMetadataMap';
import { LegacyMetadataReader } from '../models/LegacyMetadataReader';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';
import { getClassElementMetadataFromNewable } from './getClassElementMetadataFromNewable';
import { getClassMetadataConstructorArgumentsFromMetadataReader } from './getClassMetadataConstructorArgumentsFromMetadataReader';

describe(getClassMetadataConstructorArgumentsFromMetadataReader.name, () => {
  describe('when called, and getReflectMetadata() provides typescript metadata', () => {
    let typescriptTypeFixture: Newable;

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      typescriptTypeFixture = class {};

      typeFixture = class {};
      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      metadataReaderMock.getConstructorMetadata.mockReturnValueOnce({
        compilerGeneratedMetadata: [typescriptTypeFixture],
        userGeneratedMetadata: {},
      });

      (
        getClassElementMetadataFromNewable as jest.Mock<
          typeof getClassElementMetadataFromNewable
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArgumentsFromMetadataReader(
        typeFixture,
        metadataReaderMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataReader.getConstructorMetadata()', () => {
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledWith(
        typeFixture,
      );
    });

    it('should call getClassElementMetadataFromNewable()', () => {
      expect(getClassElementMetadataFromNewable).toHaveBeenCalledTimes(1);
      expect(getClassElementMetadataFromNewable).toHaveBeenCalledWith(
        typescriptTypeFixture,
      );
    });

    it('should return ClassElementMetadata[]', () => {
      expect(result).toStrictEqual([classElementMetadataFixture]);
    });
  });

  describe('when called, and getReflectMetadata() provides tag metadata', () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      legacyMetadataMapPropertyFixture = '0';
      legacyMetadataListFixture = [
        {
          key: 'key-fixture',
          value: 'value-fixture',
        },
      ];

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      typeFixture = class {};
      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      metadataReaderMock.getConstructorMetadata.mockReturnValueOnce({
        compilerGeneratedMetadata: undefined,
        userGeneratedMetadata: legacyMetadataMap,
      });

      (
        getClassElementMetadataFromLegacyMetadata as jest.Mock<
          typeof getClassElementMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArgumentsFromMetadataReader(
        typeFixture,
        metadataReaderMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataReader.getConstructorMetadata()', () => {
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledWith(
        typeFixture,
      );
    });

    it('should call getClassElementMetadataFromLegacyMetadata()', () => {
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        legacyMetadataListFixture,
      );
    });

    it('should return ClassElementMetadata[]', () => {
      expect(result).toStrictEqual([classElementMetadataFixture]);
    });
  });

  describe('when called, and getReflectMetadata() provides both typescript and tag metadata', () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let typescriptTypeFixture: Newable;

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      legacyMetadataMapPropertyFixture = '0';
      legacyMetadataListFixture = [
        {
          key: 'key-fixture',
          value: 'value-fixture',
        },
      ];

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      typescriptTypeFixture = class {};

      typeFixture = class {};
      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      metadataReaderMock.getConstructorMetadata.mockReturnValueOnce({
        compilerGeneratedMetadata: [typescriptTypeFixture],
        userGeneratedMetadata: legacyMetadataMap,
      });

      (
        getClassElementMetadataFromLegacyMetadata as jest.Mock<
          typeof getClassElementMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArgumentsFromMetadataReader(
        typeFixture,
        metadataReaderMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataReader.getConstructorMetadata()', () => {
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(metadataReaderMock.getConstructorMetadata).toHaveBeenCalledWith(
        typeFixture,
      );
    });

    it('should call getClassElementMetadataFromLegacyMetadata()', () => {
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        legacyMetadataListFixture,
      );
    });

    it('should not call getClassElementMetadataFromNewable()', () => {
      expect(getClassElementMetadataFromNewable).not.toHaveBeenCalled();
    });

    it('should return ClassElementMetadata[]', () => {
      expect(result).toStrictEqual([classElementMetadataFixture]);
    });
  });
});
