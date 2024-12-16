import { beforeAll, describe, expect, it } from '@jest/globals';

import 'reflect-metadata';

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ClassMetadata } from '../models/ClassMetadata';
import { unmanaged } from './unmanaged';

describe(unmanaged.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @unmanaged()
        public readonly bar!: string;

        @unmanaged()
        public readonly baz!: string;

        constructor(
          @unmanaged()
          public firstParam: number,
          @unmanaged()
          public secondParam: number,
        ) {}
      }

      result = getReflectMetadata(Foo, classMetadataReflectKey);
    });

    it('should return expected metadata', () => {
      const expected: ClassMetadata = {
        constructorArguments: [
          {
            kind: ClassElementMetadataKind.unmanaged,
          },
          {
            kind: ClassElementMetadataKind.unmanaged,
          },
        ],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map([
          [
            'bar',
            {
              kind: ClassElementMetadataKind.unmanaged,
            },
          ],
          [
            'baz',
            {
              kind: ClassElementMetadataKind.unmanaged,
            },
          ],
        ]),
        scope: undefined,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
