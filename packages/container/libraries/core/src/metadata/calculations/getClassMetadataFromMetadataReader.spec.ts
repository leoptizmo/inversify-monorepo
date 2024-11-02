import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

jest.mock('./getClassMetadataConstructorArgumentsFromMetadataReader');
jest.mock('./getClassMetadataPropertiesFromMetadataReader');

import { Newable } from '@inversifyjs/common';

import { POST_CONSTRUCT, PRE_DESTROY } from '../../reflectMetadata/data/keys';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ClassMetadata } from '../models/ClassMetadata';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { LegacyMetadataReader } from '../models/LegacyMetadataReader';
import { getClassMetadataConstructorArgumentsFromMetadataReader } from './getClassMetadataConstructorArgumentsFromMetadataReader';
import { getClassMetadataFromMetadataReader } from './getClassMetadataFromMetadataReader';
import { getClassMetadataPropertiesFromMetadataReader } from './getClassMetadataPropertiesFromMetadataReader';

describe(getClassMetadataFromMetadataReader.name, () => {
  describe('when called, and getReflectMetadata() returns LegacyMetadata', () => {
    let constructorArgumentsMetadataFixture: ClassElementMetadata[];
    let propertiesMetadataFixture: Map<string | symbol, ClassElementMetadata>;
    let postConstructMetadataFixture: LegacyMetadata;
    let preDestroyMetadataFixture: LegacyMetadata;

    let typeFixture: Newable;
    let metadataReaderFixture: LegacyMetadataReader;

    let result: unknown;

    beforeAll(() => {
      constructorArgumentsMetadataFixture = [
        {
          kind: ClassElementMetadataKind.unmanaged,
        },
      ];

      propertiesMetadataFixture = new Map([
        [
          'property-fixture',
          {
            kind: ClassElementMetadataKind.singleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: Symbol(),
          },
        ],
      ]);

      postConstructMetadataFixture = {
        key: 'post-construct-key-fixture',
        value: 'post-construct-value-fixture',
      };

      preDestroyMetadataFixture = {
        key: 'pre-destroy-key-fixture',
        value: 'pre-destroy-value-fixture',
      };

      typeFixture = class {};
      metadataReaderFixture = Symbol() as unknown as LegacyMetadataReader;

      (
        getClassMetadataConstructorArgumentsFromMetadataReader as jest.Mock<
          typeof getClassMetadataConstructorArgumentsFromMetadataReader
        >
      ).mockReturnValueOnce(constructorArgumentsMetadataFixture);

      (
        getClassMetadataPropertiesFromMetadataReader as jest.Mock<
          typeof getClassMetadataPropertiesFromMetadataReader
        >
      ).mockReturnValueOnce(propertiesMetadataFixture);

      (getReflectMetadata as jest.Mock<typeof getReflectMetadata>)
        .mockReturnValueOnce(postConstructMetadataFixture)
        .mockReturnValueOnce(preDestroyMetadataFixture);

      result = getClassMetadataFromMetadataReader(
        typeFixture,
        metadataReaderFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getReflectMetadata()', () => {
      expect(getReflectMetadata).toHaveBeenCalledTimes(2);
      expect(getReflectMetadata).toHaveBeenNthCalledWith(
        1,
        typeFixture,
        POST_CONSTRUCT,
      );
      expect(getReflectMetadata).toHaveBeenNthCalledWith(
        2,
        typeFixture,
        PRE_DESTROY,
      );
    });

    it('should call getClassMetadataConstructorArgumentsFromMetadataReader()', () => {
      expect(
        getClassMetadataConstructorArgumentsFromMetadataReader,
      ).toHaveBeenCalledTimes(1);
      expect(
        getClassMetadataConstructorArgumentsFromMetadataReader,
      ).toHaveBeenCalledWith(typeFixture, metadataReaderFixture);
    });

    it('should call getClassMetadataPropertiesFromMetadataReader()', () => {
      expect(
        getClassMetadataPropertiesFromMetadataReader,
      ).toHaveBeenCalledTimes(1);
      expect(getClassMetadataPropertiesFromMetadataReader).toHaveBeenCalledWith(
        typeFixture,
        metadataReaderFixture,
      );
    });

    it('should return ClassMetadata', () => {
      const expected: ClassMetadata = {
        constructorArguments: constructorArgumentsMetadataFixture,
        lifecycle: {
          postConstructMethodName: postConstructMetadataFixture.value as string,
          preDestroyMethodName: preDestroyMetadataFixture.value as string,
        },
        properties: propertiesMetadataFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
