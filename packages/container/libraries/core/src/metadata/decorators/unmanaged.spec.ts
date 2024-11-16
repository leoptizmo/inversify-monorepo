import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock(
  '../calculations/buildUnmanagedMetadataFromMaybeClassElementMetadata',
);
jest.mock('./injectBase');

import { buildUnmanagedMetadataFromMaybeClassElementMetadata } from '../calculations/buildUnmanagedMetadataFromMaybeClassElementMetadata';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { injectBase } from './injectBase';
import { unmanaged } from './unmanaged';

describe(unmanaged.name, () => {
  describe('having a non undefined propertyKey and an undefined parameterIndex', () => {
    let targetFixture: object;
    let propertyKeyFixture: string | symbol;

    beforeAll(() => {
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
          buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
          injectBaseDecoratorMock,
        );

        result = unmanaged()(targetFixture, propertyKeyFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildUnmanagedMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith();
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
  });

  describe('having a undefined propertyKey and an non undefined parameterIndex', () => {
    let targetFixture: object;
    let paramIndexFixture: number;

    beforeAll(() => {
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
          buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
            typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
          >
        ).mockReturnValueOnce(updateMetadataMock);

        (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
          injectBaseDecoratorMock,
        );

        result = unmanaged()(targetFixture, undefined, paramIndexFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildUnmanagedMetadataFromMaybeClassElementMetadata()', () => {
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledTimes(1);
        expect(
          buildUnmanagedMetadataFromMaybeClassElementMetadata,
        ).toHaveBeenCalledWith();
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
  });
});
