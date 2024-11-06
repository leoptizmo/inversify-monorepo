import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

jest.mock('./getPropertyMetadataFromLegacyMetadata');

import { Newable } from '@inversifyjs/common';

import { TAGGED_PROP } from '../../reflectMetadata/data/keys';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { LegacyMetadataMap } from '../models/LegacyMetadataMap';
import { getClassMetadataProperties } from './getClassMetadataProperties';
import { getPropertyMetadataFromLegacyMetadata } from './getPropertyMetadataFromLegacyMetadata';

describe(getClassMetadataProperties.name, () => {
  describe('when called, and getReflectMetadata returns undefined', () => {
    let typeFixture: Newable;

    let result: unknown;

    beforeAll(() => {
      typeFixture = class {};

      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(undefined);

      result = getClassMetadataProperties(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(typeFixture, TAGGED_PROP);
    });

    it('should return an empty Map', () => {
      expect(result).toStrictEqual(new Map());
    });
  });

  describe('when called, and getReflectMetadata returns LegacyMetadataMap with a symbol property', () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let classElementMetadataFixture: ClassElementMetadata;

    let typeFixture: Newable;

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

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(legacyMetadataMap);

      (
        getPropertyMetadataFromLegacyMetadata as jest.Mock<
          typeof getPropertyMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataProperties(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(typeFixture, TAGGED_PROP);
    });

    it('should call getPropertyMetadataFromLegacyMetadata()', () => {
      expect(getPropertyMetadataFromLegacyMetadata).toHaveBeenCalledTimes(1);
      expect(getPropertyMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        typeFixture,
        legacyMetadataMapPropertyFixture,
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

  describe('when called, and getReflectMetadata returns LegacyMetadataMap with a string property', () => {
    let legacyMetadataMapPropertyFixture: string | symbol;
    let legacyMetadataListFixture: LegacyMetadata[];

    let classElementMetadataFixture: ClassElementMetadata;

    let typeFixture: Newable;

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

      const legacyMetadataMap: LegacyMetadataMap = {
        [legacyMetadataMapPropertyFixture]: legacyMetadataListFixture,
      };

      (
        getReflectMetadata as jest.Mock<typeof getReflectMetadata>
      ).mockReturnValueOnce(legacyMetadataMap);

      (
        getPropertyMetadataFromLegacyMetadata as jest.Mock<
          typeof getPropertyMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataProperties(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(1);
      expect(getReflectMetadata).toHaveBeenCalledWith(typeFixture, TAGGED_PROP);
    });

    it('should call getPropertyMetadataFromLegacyMetadata()', () => {
      expect(getPropertyMetadataFromLegacyMetadata).toHaveBeenCalledTimes(1);
      expect(getPropertyMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        typeFixture,
        legacyMetadataMapPropertyFixture,
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
