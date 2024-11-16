import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ServiceIdentifier } from '@inversifyjs/common';

jest.mock('../calculations/buildManagedMetadataFromMaybeClassElementMetadata');
jest.mock('../calculations/handleInjectionError');
jest.mock('./injectBase');

import { buildManagedMetadataFromMaybeClassElementMetadata } from '../calculations/buildManagedMetadataFromMaybeClassElementMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { injectBase } from './injectBase';
import { multiInject } from './multiInject';

describe(multiInject.name, () => {
  describe('having a non undefined propertyKey and an undefined parameterIndex', () => {
    let serviceIdentifierFixture: ServiceIdentifier;
    let targetFixture: object;
    let propertyKeyFixture: string | symbol;

    beforeAll(() => {
      serviceIdentifierFixture = 'service-id-fixture';
      targetFixture = class {};
      propertyKeyFixture = 'property-key';
    });

    describe('when called', () => {
      let injectBaseDecoratorMock: jest.Mock<
        ParameterDecorator & PropertyDecorator
      > &
        ParameterDecorator &
        PropertyDecorator;

      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined,
        ) => ClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        injectBaseDecoratorMock = jest.fn() as jest.Mock<
          ParameterDecorator & PropertyDecorator
        > &
          ParameterDecorator &
          PropertyDecorator;

        updateMetadataMock = jest.fn();

        (
          buildManagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildManagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
          injectBaseDecoratorMock,
        );

        result = multiInject(serviceIdentifierFixture)(
          targetFixture,
          propertyKeyFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildManagedMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildManagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildManagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith(
          ClassElementMetadataKind.multipleInjection,
          serviceIdentifierFixture,
        );
      });

      it('should call injectBase()', () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(updateMetadataMock);
      });

      it('should call injectBaseDecorator()', () => {
        expect(injectBaseDecoratorMock).toHaveBeenCalledTimes(1);
        expect(injectBaseDecoratorMock).toHaveBeenCalledWith(
          targetFixture,
          propertyKeyFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and injectBase throws an Error', () => {
      let errorFixture: Error;
      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined,
        ) => ClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        errorFixture = new Error('message-error-fixture');
        updateMetadataMock = jest.fn();

        (
          buildManagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildManagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockImplementation(
          (): never => {
            throw errorFixture;
          },
        );

        (
          handleInjectionError as jest.Mock<typeof handleInjectionError>
        ).mockImplementation(
          (
            _target: object,
            _propertyKey: string | symbol | undefined,
            _parameterIndex: number | undefined,
            error: unknown,
          ): never => {
            throw error;
          },
        );

        try {
          multiInject(serviceIdentifierFixture)(
            targetFixture,
            propertyKeyFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildManagedMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildManagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildManagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith(
          ClassElementMetadataKind.multipleInjection,
          serviceIdentifierFixture,
        );
      });

      it('should call injectBase()', () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(updateMetadataMock);
      });

      it('should throw handleInjectionError()', () => {
        expect(handleInjectionError).toHaveBeenCalledTimes(1);
        expect(handleInjectionError).toHaveBeenCalledWith(
          targetFixture,
          propertyKeyFixture,
          undefined,
          errorFixture,
        );
      });

      it('should throw an Error', () => {
        expect(result).toBe(errorFixture);
      });
    });
  });

  describe('having a undefined propertyKey and an non undefined parameterIndex', () => {
    let serviceIdentifierFixture: ServiceIdentifier;
    let targetFixture: object;
    let paramIndexFixture: number;

    beforeAll(() => {
      serviceIdentifierFixture = 'service-id-fixture';
      targetFixture = class {};
      paramIndexFixture = 0;
    });

    describe('when called', () => {
      let injectBaseDecoratorMock: jest.Mock<
        ParameterDecorator & PropertyDecorator
      > &
        ParameterDecorator &
        PropertyDecorator;

      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined,
        ) => ClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        injectBaseDecoratorMock = jest.fn() as jest.Mock<
          ParameterDecorator & PropertyDecorator
        > &
          ParameterDecorator &
          PropertyDecorator;

        updateMetadataMock = jest.fn();

        (
          buildManagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildManagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
          injectBaseDecoratorMock,
        );

        result = multiInject(serviceIdentifierFixture)(
          targetFixture,
          undefined,
          paramIndexFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildManagedMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildManagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildManagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith(
          ClassElementMetadataKind.multipleInjection,
          serviceIdentifierFixture,
        );
      });

      it('should call injectBase()', () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(updateMetadataMock);
      });

      it('should call injectBaseDecorator()', () => {
        expect(injectBaseDecoratorMock).toHaveBeenCalledTimes(1);
        expect(injectBaseDecoratorMock).toHaveBeenCalledWith(
          targetFixture,
          undefined,
          paramIndexFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and injectBase throws an Error', () => {
      let errorFixture: Error;
      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined,
        ) => ClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        errorFixture = new Error('message-error-fixture');
        updateMetadataMock = jest.fn();

        (
          buildManagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildManagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockImplementation(
          (): never => {
            throw errorFixture;
          },
        );

        (
          handleInjectionError as jest.Mock<typeof handleInjectionError>
        ).mockImplementation(
          (
            _target: object,
            _propertyKey: string | symbol | undefined,
            _parameterIndex: number | undefined,
            error: unknown,
          ): never => {
            throw error;
          },
        );

        try {
          multiInject(serviceIdentifierFixture)(
            targetFixture,
            undefined,
            paramIndexFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildManagedMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildManagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildManagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith(
          ClassElementMetadataKind.multipleInjection,
          serviceIdentifierFixture,
        );
      });

      it('should call injectBase()', () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(updateMetadataMock);
      });

      it('should throw handleInjectionError()', () => {
        expect(handleInjectionError).toHaveBeenCalledTimes(1);
        expect(handleInjectionError).toHaveBeenCalledWith(
          targetFixture,
          undefined,
          paramIndexFixture,
          errorFixture,
        );
      });

      it('should throw an Error', () => {
        expect(result).toBe(errorFixture);
      });
    });
  });
});
