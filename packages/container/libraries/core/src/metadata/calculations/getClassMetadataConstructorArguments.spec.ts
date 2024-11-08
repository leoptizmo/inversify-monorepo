import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { Newable } from '@inversifyjs/common';
import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

jest.mock('./assertConstructorMetadataArrayFilled');
jest.mock('./getClassElementMetadataFromNewable');
jest.mock('./getConstructorArgumentMetadataFromLegacyMetadata');

import { DESIGN_PARAM_TYPES, TAGGED } from '../../reflectMetadata/data/keys';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { LegacyMetadataMap } from '../models/LegacyMetadataMap';
import { assertConstructorMetadataArrayFilled } from './assertConstructorMetadataArrayFilled';
import { getClassElementMetadataFromNewable } from './getClassElementMetadataFromNewable';
import { getClassMetadataConstructorArguments } from './getClassMetadataConstructorArguments';
import { getConstructorArgumentMetadataFromLegacyMetadata } from './getConstructorArgumentMetadataFromLegacyMetadata';

describe(getClassMetadataConstructorArguments.name, () => {
  describe('when called, and getReflectMetadata() provides typescript metadata', () => {
    let typescriptTypeFixture: Newable;
    let typeFixture: Newable;

    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      typescriptTypeFixture = class {};

      typeFixture = class {};

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      (getReflectMetadata as jest.Mock<typeof getReflectMetadata>)
        .mockReturnValueOnce([typescriptTypeFixture])
        .mockReturnValueOnce(undefined);

      (
        getClassElementMetadataFromNewable as jest.Mock<
          typeof getClassElementMetadataFromNewable
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArguments(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(2);
      expect(getReflectMetadata).toHaveBeenNthCalledWith(
        1,
        typeFixture,
        DESIGN_PARAM_TYPES,
      );
      expect(getReflectMetadata).toHaveBeenNthCalledWith(
        2,
        typeFixture,
        TAGGED,
      );
    });

    it('should call getClassElementMetadataFromNewable()', () => {
      expect(getClassElementMetadataFromNewable).toHaveBeenCalledTimes(1);
      expect(getClassElementMetadataFromNewable).toHaveBeenCalledWith(
        typescriptTypeFixture,
      );
    });

    it('should call assertConstructorMetadataArrayFilled()', () => {
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledTimes(1);
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledWith(
        typeFixture,
        [classElementMetadataFixture],
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

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      (getReflectMetadata as jest.Mock<typeof getReflectMetadata>)
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(legacyMetadataMap);

      (
        getConstructorArgumentMetadataFromLegacyMetadata as jest.Mock<
          typeof getConstructorArgumentMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArguments(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(2);
      expect(getReflectMetadata).toHaveBeenNthCalledWith(
        1,
        typeFixture,
        DESIGN_PARAM_TYPES,
      );
      expect(getReflectMetadata).toHaveBeenNthCalledWith(
        2,
        typeFixture,
        TAGGED,
      );
    });

    it('should call getConstructorArgumentMetadataFromLegacyMetadata()', () => {
      expect(
        getConstructorArgumentMetadataFromLegacyMetadata,
      ).toHaveBeenCalledTimes(1);
      expect(
        getConstructorArgumentMetadataFromLegacyMetadata,
      ).toHaveBeenCalledWith(typeFixture, 0, legacyMetadataListFixture);
    });

    it('should call assertConstructorMetadataArrayFilled()', () => {
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledTimes(1);
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledWith(
        typeFixture,
        [classElementMetadataFixture],
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

      classElementMetadataFixture = {
        kind: ClassElementMetadataKind.unmanaged,
      };

      (getReflectMetadata as jest.Mock<typeof getReflectMetadata>)
        .mockReturnValueOnce([typescriptTypeFixture])
        .mockReturnValueOnce(legacyMetadataMap);

      (
        getConstructorArgumentMetadataFromLegacyMetadata as jest.Mock<
          typeof getConstructorArgumentMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getClassMetadataConstructorArguments(typeFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(2);
      expect(getReflectMetadata).toHaveBeenNthCalledWith(
        1,
        typeFixture,
        DESIGN_PARAM_TYPES,
      );
      expect(getReflectMetadata).toHaveBeenNthCalledWith(
        2,
        typeFixture,
        TAGGED,
      );
    });

    it('should call getConstructorArgumentMetadataFromLegacyMetadata()', () => {
      expect(
        getConstructorArgumentMetadataFromLegacyMetadata,
      ).toHaveBeenCalledTimes(1);
      expect(
        getConstructorArgumentMetadataFromLegacyMetadata,
      ).toHaveBeenCalledWith(typeFixture, 0, legacyMetadataListFixture);
    });

    it('should not call getClassElementMetadataFromNewable()', () => {
      expect(getClassElementMetadataFromNewable).not.toHaveBeenCalled();
    });

    it('should call assertConstructorMetadataArrayFilled()', () => {
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledTimes(1);
      expect(assertConstructorMetadataArrayFilled).toHaveBeenCalledWith(
        typeFixture,
        [classElementMetadataFixture],
      );
    });

    it('should return ClassElementMetadata[]', () => {
      expect(result).toStrictEqual([classElementMetadataFixture]);
    });
  });
});
