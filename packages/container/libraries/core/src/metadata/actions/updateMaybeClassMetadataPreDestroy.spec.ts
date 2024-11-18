import { beforeAll, describe, expect, it } from '@jest/globals';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';
import { updateMaybeClassMetadataPreDestroy } from './updateMaybeClassMetadataPreDestroy';

describe(updateMaybeClassMetadataPreDestroy.name, () => {
  describe('having metadata with no postConstructorMethodName', () => {
    let metadataFixture: MaybeClassMetadata;
    let methodNameFixture: string | symbol;

    beforeAll(() => {
      metadataFixture = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: undefined,
        },
        properties: new Map(),
      };
      methodNameFixture = Symbol();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result =
          updateMaybeClassMetadataPreDestroy(methodNameFixture)(
            metadataFixture,
          );
      });

      it('should return MaybeClassMetadata', () => {
        const expected: MaybeClassMetadata = {
          constructorArguments: [],
          lifecycle: {
            postConstructMethodName: undefined,
            preDestroyMethodName: methodNameFixture,
          },
          properties: new Map(),
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having metadata with postConstructorMethodName', () => {
    let metadataFixture: MaybeClassMetadata;
    let methodNameFixture: string | symbol;

    beforeAll(() => {
      metadataFixture = {
        constructorArguments: [],
        lifecycle: {
          postConstructMethodName: undefined,
          preDestroyMethodName: 'postConstructorMethodName',
        },
        properties: new Map(),
      };
      methodNameFixture = Symbol();
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        try {
          updateMaybeClassMetadataPreDestroy(methodNameFixture)(
            metadataFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw InversifyCoreError', () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.injectionDecoratorConflict,
          message: 'Unexpected duplicated preDestroy decorator',
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
