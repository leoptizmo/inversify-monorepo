import { beforeAll, describe, expect, it } from '@jest/globals';

import 'reflect-metadata';

import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ClassMetadata } from '../models/ClassMetadata';
import { inject } from './inject';

describe(inject.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      class Foo {
        @inject('bar')
        public readonly bar!: string;

        @inject('baz')
        public readonly baz!: string;

        constructor(
          @inject('firstParam')
          public firstParam: number,
          @inject('secondParam')
          public secondParam: number,
        ) {}
      }

      result = getReflectMetadata(Foo, classMetadataReflectKey);
    });

    it('should return expected metadata', () => {
      const expected: ClassMetadata = {
        constructorArguments: [
          {
            kind: ClassElementMetadataKind.singleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
            value: 'firstParam',
          },
          {
            kind: ClassElementMetadataKind.singleInjection,
            name: undefined,
            optional: false,
            tags: new Map(),
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
              kind: ClassElementMetadataKind.singleInjection,
              name: undefined,
              optional: false,
              tags: new Map(),
              value: 'bar',
            },
          ],
          [
            'baz',
            {
              kind: ClassElementMetadataKind.singleInjection,
              name: undefined,
              optional: false,
              tags: new Map(),
              value: 'baz',
            },
          ],
        ]),
        scope: undefined,
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
