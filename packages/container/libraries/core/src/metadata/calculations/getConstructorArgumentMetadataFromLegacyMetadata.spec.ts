import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./getClassElementMetadataFromLegacyMetadata');

import { Newable } from '@inversifyjs/common';

import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { getClassElementMetadataFromLegacyMetadata } from './getClassElementMetadataFromLegacyMetadata';
import { getConstructorArgumentMetadataFromLegacyMetadata } from './getConstructorArgumentMetadataFromLegacyMetadata';

describe(getConstructorArgumentMetadataFromLegacyMetadata.name, () => {
  let typeFixture: Newable;
  let indexFixture: number;
  let metadataListFixture: LegacyMetadata[];

  beforeAll(() => {
    typeFixture = class {};
    indexFixture = 0;
    metadataListFixture = [
      {
        key: Symbol(),
        value: Symbol(),
      },
    ];
  });

  describe('when called', () => {
    let classElementMetadataFixture: ClassElementMetadata;

    let result: unknown;

    beforeAll(() => {
      classElementMetadataFixture = Symbol() as unknown as ClassElementMetadata;

      (
        getClassElementMetadataFromLegacyMetadata as jest.Mock<
          typeof getClassElementMetadataFromLegacyMetadata
        >
      ).mockReturnValueOnce(classElementMetadataFixture);

      result = getConstructorArgumentMetadataFromLegacyMetadata(
        typeFixture,
        indexFixture,
        metadataListFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getClassElementMetadataFromLegacyMetadata()', () => {
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        metadataListFixture,
      );
    });

    it('should return ClassElementMetadata', () => {
      expect(result).toBe(classElementMetadataFixture);
    });
  });

  describe('when called, and getClassElementMetadataFromLegacyMetadata() throws an InversifyCoreError with kind missingInjectionDecorator', () => {
    let errorFixture: InversifyCoreError;

    let result: unknown;

    beforeAll(() => {
      errorFixture = new InversifyCoreError(
        InversifyCoreErrorKind.missingInjectionDecorator,
        'Error fixture',
      );

      (
        getClassElementMetadataFromLegacyMetadata as jest.Mock<
          typeof getClassElementMetadataFromLegacyMetadata
        >
      ).mockImplementation((): never => {
        throw errorFixture;
      });

      try {
        getConstructorArgumentMetadataFromLegacyMetadata(
          typeFixture,
          indexFixture,
          metadataListFixture,
        );
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getClassElementMetadataFromLegacyMetadata()', () => {
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        metadataListFixture,
      );
    });

    it('should throw InversifyCoreError', () => {
      const expectedErrorProperties: Partial<InversifyCoreError> = {
        cause: errorFixture,
        kind: InversifyCoreErrorKind.missingInjectionDecorator,
        message: `Expected a single @inject, @multiInject or @unmanaged decorator at type "${typeFixture.name}" at constructor arguments at index "${indexFixture.toString()}"`,
      };

      expect(result).toBeInstanceOf(InversifyCoreError);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedErrorProperties),
      );
    });
  });

  describe('when called, and getClassElementMetadataFromLegacyMetadata() throws an Error', () => {
    let errorFixture: Error;

    let result: unknown;

    beforeAll(() => {
      errorFixture = new Error('Error fixture');

      (
        getClassElementMetadataFromLegacyMetadata as jest.Mock<
          typeof getClassElementMetadataFromLegacyMetadata
        >
      ).mockImplementation((): never => {
        throw errorFixture;
      });

      try {
        getConstructorArgumentMetadataFromLegacyMetadata(
          typeFixture,
          indexFixture,
          metadataListFixture,
        );
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getClassElementMetadataFromLegacyMetadata()', () => {
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(getClassElementMetadataFromLegacyMetadata).toHaveBeenCalledWith(
        metadataListFixture,
      );
    });

    it('should throw InversifyCoreError', () => {
      expect(result).toBe(errorFixture);
    });
  });
});
