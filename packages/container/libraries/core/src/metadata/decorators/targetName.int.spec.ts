import { beforeAll, describe, expect, it } from '@jest/globals';

import 'reflect-metadata';

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';
import { targetName } from './targetName';

describe(targetName.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @targetName('bar')
        public readonly bar!: string;

        @targetName('baz')
        public readonly baz!: string;

        constructor(
          @targetName('firstParam')
          public firstParam: number,
          @targetName('secondParam')
          public secondParam: number,
        ) {}
      }

      result = getReflectMetadata(Foo, classMetadataReflectKey);
    });

    it('should return expected metadata', () => {
      const expected: MaybeClassMetadata = {
        constructorArguments: [
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: 'firstParam',
          },
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: 'secondParam',
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
              kind: MaybeClassElementMetadataKind.unknown,
              name: undefined,
              optional: false,
              tags: new Map(),
              targetName: 'bar',
            },
          ],
          [
            'baz',
            {
              kind: MaybeClassElementMetadataKind.unknown,
              name: undefined,
              optional: false,
              tags: new Map(),
              targetName: 'baz',
            },
          ],
        ]),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
