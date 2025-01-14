import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../actions/updateMetadataName');
jest.mock(
  '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata',
);
jest.mock('../calculations/handleInjectionError');
jest.mock('./injectBase');

import { incrementPendingClassMetadataCount } from '../actions/incrementPendingClassMetadataCount';
import { updateMetadataName } from '../actions/updateMetadataName';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata';
import { handleInjectionError } from '../calculations/handleInjectionError';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { injectBase } from './injectBase';
import { named } from './named';

describe(named.name, () => {
  let updateMetadataNameResultMock: jest.Mock<
    (
      metadata: ManagedClassElementMetadata | MaybeManagedClassElementMetadata,
    ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata
  >;

  beforeAll(() => {
    updateMetadataNameResultMock = jest.fn();

    (
      updateMetadataName as jest.Mock<typeof updateMetadataName>
    ).mockReturnValue(updateMetadataNameResultMock);
  });

  describe('having a non undefined propertyKey and an undefined parameterIndex', () => {
    let targetFixture: object;
    let propertyKeyFixture: string | symbol;

    beforeAll(() => {
      targetFixture = class {};
      propertyKeyFixture = 'property-key';
    });

    describe('when called', () => {
      let nameFixture: string;
      let injectBaseDecoratorMock: jest.Mock<
        ParameterDecorator & PropertyDecorator
      > &
        ParameterDecorator &
        PropertyDecorator;

      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined,
        ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        nameFixture = 'name-fixture';
        injectBaseDecoratorMock = jest.fn() as jest.Mock<
          ParameterDecorator & PropertyDecorator
        > &
          ParameterDecorator &
          PropertyDecorator;

        updateMetadataMock = jest.fn();

        (
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildMaybeClassElementMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
          injectBaseDecoratorMock,
        );

        result = named(nameFixture)(targetFixture, propertyKeyFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildMaybeClassElementMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call injectBase()', () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(
          updateMetadataMock,
          incrementPendingClassMetadataCount,
        );
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
      let nameFixture: string;
      let errorFixture: Error;
      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined,
        ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        nameFixture = 'name-fixture';
        errorFixture = new Error('message-error-fixture');
        updateMetadataMock = jest.fn();

        (
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildMaybeClassElementMetadataFromMaybeClassElementMetadata
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
            _target: unknown,
            _propertyKey: unknown,
            _parameterIndex: unknown,
            error: unknown,
          ): never => {
            throw error;
          },
        );

        try {
          named(nameFixture)(targetFixture, propertyKeyFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildMaybeClassElementMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call injectBase()', () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(
          updateMetadataMock,
          incrementPendingClassMetadataCount,
        );
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

  describe('having an undefined propertyKey and an non undefined parameterIndex', () => {
    let targetFixture: object;
    let paramIndexFixture: number;

    beforeAll(() => {
      targetFixture = class {};
      paramIndexFixture = 0;
    });

    describe('when called', () => {
      let nameFixture: string;
      let injectBaseDecoratorMock: jest.Mock<
        ParameterDecorator & PropertyDecorator
      > &
        ParameterDecorator &
        PropertyDecorator;

      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined,
        ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        nameFixture = 'name-fixture';
        injectBaseDecoratorMock = jest.fn() as jest.Mock<
          ParameterDecorator & PropertyDecorator
        > &
          ParameterDecorator &
          PropertyDecorator;

        updateMetadataMock = jest.fn();

        (
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildMaybeClassElementMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
          injectBaseDecoratorMock,
        );

        result = named(nameFixture)(
          targetFixture,
          undefined,
          paramIndexFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildMaybeClassElementMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call injectBase()', () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(
          updateMetadataMock,
          incrementPendingClassMetadataCount,
        );
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
      let nameFixture: string;
      let errorFixture: Error;
      let updateMetadataMock: jest.Mock<
        (
          classElementMetadata: MaybeClassElementMetadata | undefined,
        ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata
      >;

      let result: unknown;

      beforeAll(() => {
        nameFixture = 'name-fixture';
        errorFixture = new Error('message-error-fixture');
        updateMetadataMock = jest.fn();

        (
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildMaybeClassElementMetadataFromMaybeClassElementMetadata
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
            _target: unknown,
            _propertyKey: unknown,
            _parameterIndex: unknown,
            error: unknown,
          ): never => {
            throw error;
          },
        );

        try {
          named(nameFixture)(targetFixture, undefined, paramIndexFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildMaybeClassElementMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith(expect.any(Function));
      });

      it('should call injectBase()', () => {
        expect(injectBase).toHaveBeenCalledTimes(1);
        expect(injectBase).toHaveBeenCalledWith(
          updateMetadataMock,
          incrementPendingClassMetadataCount,
        );
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
