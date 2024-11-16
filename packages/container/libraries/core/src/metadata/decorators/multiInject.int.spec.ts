import { beforeAll, describe, expect, it } from '@jest/globals';

import 'reflect-metadata';

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ClassMetadata } from '../models/ClassMetadata';
import { multiInject } from './multiInject';

describe(multiInject.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @multiInject('bar')
        public readonly bar!: string;

        @multiInject('baz')
        public readonly baz!: string;

        constructor(
          @multiInject('firstParam')
          public firstParam: number,
          @multiInject('secondParam')
          public secondParam: number,
        ) {}
      }

      result = getReflectMetadata(Foo, classMetadataReflectKey);
    });

    it('should return expected metadata', () => {
      const expected: ClassMetadata = {
        constructorArguments: [
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: 'firstParam',
          },
          {
            kind: ClassElementMetadataKind.multipleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            targetName: undefined,
            value: 'secondParam',
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
              kind: ClassElementMetadataKind.multipleInjection,
              name: undefined,
              optional: false,
              tags: new Map(),
              targetName: undefined,
              value: 'bar',
            },
          ],
          [
            'baz',
            {
              kind: ClassElementMetadataKind.multipleInjection,
              name: undefined,
              optional: false,
              tags: new Map(),
              targetName: undefined,
              value: 'baz',
            },
          ],
        ]),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
