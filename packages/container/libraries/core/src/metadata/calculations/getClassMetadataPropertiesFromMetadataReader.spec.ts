import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./getClassElementMetadataFromLegacyMetadata');

import { Newable } from '@inversifyjs/common';

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { LegacyMetadataMap } from '../models/LegacyMetadataMap';
import { LegacyMetadataReader } from '../models/LegacyMetadataReader';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';
import { getClassMetadataPropertiesFromMetadataReader } from './getClassMetadataPropertiesFromMetadataReader';

describe(getClassMetadataPropertiesFromMetadataReader.name, () => {
  describe('when called, and metadataReader.getPropertiesMetadata() returns LegacyMetadataMap with a symbol property', () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let classElementMetadataFixture: ClassElementMetadata;

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let result: unknown;

    beforeAll(() => {
      legacyMetadataMapPropertyFixture = Symbol();
      legacyMetadataListFixture = [
        {
          key: 'key-fixture',
          value: 'value-fixture',
        },
      ];

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: Symbol(),
      };

      typeFixture = class {};

      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      metadataReaderMock.getPropertiesMetadata.mockReturnValueOnce(
        legacyMetadataMap,
      );

      (
        getClassElementMetadataFromLegacyMetadata as jest.Mock<
          typeof getClassElementMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataPropertiesFromMetadataReader(
        typeFixture,
        metadataReaderMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataReader.getPropertiesMetadata()', () => {
      expect(metadataReaderMock.getPropertiesMetadata).toHaveBeenCalledTimes(1);
      expect(metadataReaderMock.getPropertiesMetadata).toHaveBeenCalledWith(
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

    it('should return a Map', () => {
      const expected: Map<string | symbol, ClassElementMetadata> = new Map([
        [legacyMetadataMapPropertyFixture, classElementMetadataFixture],
      ]);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when called, and metadataReader.getPropertiesMetadata() returns LegacyMetadataMap with a string property', () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let classElementMetadataFixture: ClassElementMetadata;

    let typeFixture: Newable;
    let metadataReaderMock: jest.Mocked<LegacyMetadataReader>;

    let result: unknown;

    beforeAll(() => {
      legacyMetadataMapPropertyFixture = 'property-fixture';
      legacyMetadataListFixture = [
        {
          key: 'key-fixture',
          value: 'value-fixture',
        },
      ];

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.singleInjection,
        name: undefined,
        optional: false,
        tags: new Map(),
        targetName: undefined,
        value: Symbol(),
      };

      typeFixture = class {};
      metadataReaderMock = {
        getConstructorMetadata: jest.fn(),
        getPropertiesMetadata: jest.fn(),
      };

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      metadataReaderMock.getPropertiesMetadata.mockReturnValueOnce(
        legacyMetadataMap,
      );

      (
        getClassElementMetadataFromLegacyMetadata as jest.Mock<
          typeof getClassElementMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataPropertiesFromMetadataReader(
        typeFixture,
        metadataReaderMock,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call metadataReader.getPropertiesMetadata()', () => {
      expect(metadataReaderMock.getPropertiesMetadata).toHaveBeenCalledTimes(1);
      expect(metadataReaderMock.getPropertiesMetadata).toHaveBeenCalledWith(
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

    it('should return a Map', () => {
      const expected: Map<string | symbol, ClassElementMetadata> = new Map([
        [legacyMetadataMapPropertyFixture, classElementMetadataFixture],
      ]);

      expect(result).toStrictEqual(expected);
    });
  });
});
