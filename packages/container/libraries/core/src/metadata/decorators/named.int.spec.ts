import { beforeAll, describe, expect, it } from '@jest/globals';

import 'reflect-metadata';

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';
import { named } from './named';

describe(named.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @named('bar')
        public readonly bar!: string;

        @named('baz')
        public readonly baz!: string;

        constructor(
          @named('firstParam')
          public firstParam: number,
          @named('secondParam')
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
            name: 'firstParam',
            optional: false,
            tags: new Map(),
            targetName: undefined,
          },
          {
            kind: MaybeClassElementMetadataKind.unknown,
            name: 'secondParam',
            optional: false,
            tags: new Map(),
            targetName: undefined,
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
              name: 'bar',
              optional: false,
              tags: new Map(),
              targetName: undefined,
            },
          ],
          [
            'baz',
            {
              kind: MaybeClassElementMetadataKind.unknown,
              name: 'baz',
              optional: false,
              tags: new Map(),
              targetName: undefined,
            },
          ],
        ]),
        scope: undefined,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
