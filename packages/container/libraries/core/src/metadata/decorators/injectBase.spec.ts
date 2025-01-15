import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import 'reflect-metadata';

jest.mock('@inversifyjs/reflect-metadata-utils');

jest.mock('../actions/updateMaybeClassMetadataConstructorArgument', () => ({
  updateMaybeClassMetadataConstructorArgument: jest.fn(),
}));

jest.mock('../actions/updateMaybeClassMetadataProperty', () => ({
  updateMaybeClassMetadataProperty: jest.fn(),
}));

jest.mock('../calculations/handleInjectionError');

import { Newable } from '@inversifyjs/common';
import { updateOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { updateMaybeClassMetadataConstructorArgument } from '../actions/updateMaybeClassMetadataConstructorArgument';
import { updateMaybeClassMetadataProperty } from '../actions/updateMaybeClassMetadataProperty';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';
import { injectBase } from './injectBase';

describe(injectBase.name, () => {
  let updateMetadataMock: jest.Mock<
    (
      metadata: MaybeClassElementMetadata | undefined,
    ) => MaybeClassElementMetadata
  >;
  let updatePendingClassMetadataCountMock: jest.Mock<
    (
      target: object,
    ) => (metadata: MaybeClassElementMetadata | undefined) => void
  >;

  beforeAll(() => {
    (
      handleInjectionError as jest.Mock<typeof handleInjectionError>
    ).mockImplementation(
      (
        _target: unknown,
        _propertyKey: unknown,
        _indexOrTypedDescriptor: unknown,
        error: unknown,
      ) => {
        throw error;
      },
    );

    updateMetadataMock =
      jest.fn<
        (
          metadata: MaybeClassElementMetadata | undefined,
        ) => MaybeClassElementMetadata
      >();
    updatePendingClassMetadataCountMock = jest.fn();
  });

  describe('when called, as property decorator', () => {
    let targetFixture: Newable;
    let updateMaybeClassMetadataPropertyResult: jest.Mock<
      (classMetadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    beforeAll(() => {
      updateMaybeClassMetadataPropertyResult = jest.fn();

      (
        updateMaybeClassMetadataProperty as jest.Mock<
          typeof updateMaybeClassMetadataProperty
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataPropertyResult);

      class TargetFixture {
        @injectBase(updateMetadataMock, updatePendingClassMetadataCountMock)
        public foo: string | undefined;
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateOwnReflectMetadata()', () => {
      expect(updateOwnReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateOwnReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        classMetadataReflectKey,
        getDefaultClassMetadata,
        updateMaybeClassMetadataPropertyResult,
      );
    });
  });

  describe('when called, as constructor parameter decorator', () => {
    let targetFixture: Newable;
    let updateMaybeClassMetadataConstructorArgumentsResult: jest.Mock<
      (classMetadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    beforeAll(() => {
      updateMaybeClassMetadataConstructorArgumentsResult = jest.fn();

      (
        updateMaybeClassMetadataConstructorArgument as jest.Mock<
          typeof updateMaybeClassMetadataConstructorArgument
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataConstructorArgumentsResult);

      class TargetFixture {
        constructor(
          @injectBase(updateMetadataMock, updatePendingClassMetadataCountMock)
          public foo: string | undefined,
        ) {}
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateOwnReflectMetadata()', () => {
      expect(updateOwnReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateOwnReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        classMetadataReflectKey,
        getDefaultClassMetadata,
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
            @injectBase(updateMetadataMock, updatePendingClassMetadataCountMock)
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
      const expectedPartialError: Partial<InversifyCoreError> = {
        kind: InversifyCoreErrorKind.injectionDecoratorConflict,
        message: `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "doSomethingWithFoo" at class "TargetFixture"`,
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedPartialError),
      );
    });
  });

  describe('when called, as method decorator', () => {
    let targetFixture: Newable;
    let updateMaybeClassMetadataPropertyResult: jest.Mock<
      (classMetadata: MaybeClassMetadata) => MaybeClassMetadata
    >;

    beforeAll(() => {
      updateMaybeClassMetadataPropertyResult = jest.fn();

      (
        updateMaybeClassMetadataProperty as jest.Mock<
          typeof updateMaybeClassMetadataProperty
        >
      ).mockReturnValueOnce(updateMaybeClassMetadataPropertyResult);

      class TargetFixture {
        @injectBase(updateMetadataMock, updatePendingClassMetadataCountMock)
        public set foo(_value: string | undefined) {
          // setter logic
        }
      }

      targetFixture = TargetFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call updateOwnReflectMetadata()', () => {
      expect(updateOwnReflectMetadata).toHaveBeenCalledTimes(1);
      expect(updateOwnReflectMetadata).toHaveBeenCalledWith(
        targetFixture,
        classMetadataReflectKey,
        getDefaultClassMetadata,
        updateMaybeClassMetadataPropertyResult,
      );
    });
  });

  describe('when called, as method decorator on non-setter method', () => {
    let result: unknown;

    beforeAll(() => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TargetFixture {
          @injectBase(updateMetadataMock, updatePendingClassMetadataCountMock)
          public foo(): void {
            // method logic
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
      const expectedPartialError: Partial<InversifyCoreError> = {
        kind: InversifyCoreErrorKind.injectionDecoratorConflict,
        message: `Found an @inject decorator in a non setter property method.
Found @inject decorator at method "foo" at class "TargetFixture"`,
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedPartialError),
      );
    });

    it('should call handleInjectionError()', () => {
      expect(handleInjectionError).toHaveBeenCalledTimes(1);
      expect(handleInjectionError).toHaveBeenCalledWith(
        expect.any(Object),
        'foo',
        expect.any(Object),
        expect.any(Error),
      );
    });
  });
});
