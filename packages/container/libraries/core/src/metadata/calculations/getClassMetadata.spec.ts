import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

jest.mock('./getClassMetadataConstructorArguments');
jest.mock('./getClassMetadataProperties');

import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ClassMetadata } from '../models/ClassMetadata';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { getClassMetadata } from './getClassMetadata';
import { getClassMetadataConstructorArguments } from './getClassMetadataConstructorArguments';
import { getClassMetadataProperties } from './getClassMetadataProperties';

describe(getClassMetadata.name, () => {
  describe('when called, and getReflectMetadata() returns LegacyMetadata', () => {
    let constructorArgumentsMetadataFixture: ClassElementMetadata[];
    let propertiesMetadataFixture: Map<string | symbol, ClassElementMetadata>;
    let postConstructMetadataFixture: LegacyMetadata;
    let preDestroyMetadataFixture: LegacyMetadata;

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

      (
        getClassMetadataConstructorArguments as jest.Mock<
          typeof getClassMetadataConstructorArguments
        >
      ).mockReturnValueOnce(constructorArgumentsMetadataFixture);

      (
        getClassMetadataProperties as jest.Mock<
          typeof getClassMetadataProperties
        >
      ).mockReturnValueOnce(propertiesMetadataFixture);

      (getReflectMetadata as jest.Mock<typeof getReflectMetadata>)
        .mockReturnValueOnce(postConstructMetadataFixture)
        .mockReturnValueOnce(preDestroyMetadataFixture);

      result = getClassMetadata(class {});
    });

    afterAll(() => {
      jest.clearAllMocks();
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
