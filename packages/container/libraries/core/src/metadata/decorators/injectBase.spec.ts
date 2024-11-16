import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import 'reflect-metadata';

jest.mock('@inversifyjs/reflect-metadata-utils');

jest.mock('../actions/updateMaybeClassMetadataConstructorArgument', () => ({
  updateMaybeClassMetadataConstructorArgument: jest.fn(),
}));

jest.mock('../actions/updateMaybeClassMetadataProperty', () => ({
  updateMaybeClassMetadataProperty: jest.fn(),
}));

jest.mock('../calculations/getDefaultClassMetadata');

import { Newable } from '@inversifyjs/common';
import { updateReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { updateMaybeClassMetadataConstructorArgument } from '../actions/updateMaybeClassMetadataConstructorArgument';
import { updateMaybeClassMetadataProperty } from '../actions/updateMaybeClassMetadataProperty';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { ClassMetadata } from '../models/ClassMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';
import { injectBase } from './injectBase';

describe(injectBase.name, () => {
  let updateMetadataMock: jest.Mock<
    (
      metadata: MaybeClassElementMetadata | undefined,
    ) => MaybeClassElementMetadata
  >;

  beforeAll(() => {
    updateMetadataMock =
      jest.fn<
        (
          metadata: MaybeClassElementMetadata | undefined,
        ) => MaybeClassElementMetadata
      >();
  });

  describe('when called, as property decorator', () => {
    let defaultClassMetadataFixture: ClassMetadata;
    let targetFixture: Newable;
    let updateMaybeClassMetadataPropertyResult: jest.Mock<
      (classMetadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    beforeAll(() => {
      defaultClassMetadataFixture = {
        [Symbol()]: Symbol(),
      } as unknown as ClassMetadata;

      updateMaybeClassMetadataPropertyResult = jest.fn();

      (
        getDefaultClassMetadata as jest.Mock<typeof getDefaultClassMetadata>
      ).mockReturnValueOnce(defaultClassMetadataFixture);

      (
        updateMaybeClassMetadataProperty as jest.Mock<
          typeof updateMaybeClassMetadataProperty
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataPropertyResult);

      class TargetFixture {
        @injectBase(updateMetadataMock)
        public foo: string | undefined;
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        classMetadataReflectKey,
        defaultClassMetadataFixture,
        updateMaybeClassMetadataPropertyResult,
      );
    });
  });

  describe('when called, as constructor parameter decorator', () => {
    let defaultClassMetadataFixture: ClassMetadata;
    let targetFixture: Newable;
    let updateMaybeClassMetadataConstructorArgumentsResult: jest.Mock<
      (classMetadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    beforeAll(() => {
      defaultClassMetadataFixture = {
        [Symbol()]: Symbol(),
      } as unknown as ClassMetadata;

      updateMaybeClassMetadataConstructorArgumentsResult = jest.fn();

      (
        getDefaultClassMetadata as jest.Mock<typeof getDefaultClassMetadata>
      ).mockReturnValueOnce(defaultClassMetadataFixture);

      (
        updateMaybeClassMetadataConstructorArgument as jest.Mock<
          typeof updateMaybeClassMetadataConstructorArgument
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataConstructorArgumentsResult);

      class TargetFixture {
        constructor(
          @injectBase(updateMetadataMock)
          public foo: string | undefined,
        ) {}
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateReflectMetadata()', () => {
      expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        classMetadataReflectKey,
        expect.anything(),
        updateMaybeClassMetadataConstructorArgumentsResult,
      );
    });
  });

  describe('when called, as non constructor parameter decorator', () => {
    let result: unknown;

    beforeAll(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TargetFixture {
          public doSomethingWithFoo(
            @injectBase(updateMetadataMock)
            foo: string | undefined,
          ) {
            console.log(foo ?? '?');
          }
        }
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should throw an error', () => {
      const expectedPartialError: Partial<Error> = {
        message: `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "doSomethingWithFoo" at class "TargetFixture"`,
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedPartialError),
      );
    });
  });
});
