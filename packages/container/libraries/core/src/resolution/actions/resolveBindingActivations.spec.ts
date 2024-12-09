import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ServiceIdentifier } from '@inversifyjs/common';

import { BindingActivation } from '../../binding/models/BindingActivation';
import { ResolutionParams } from '../models/ResolutionParams';
import { resolveBindingActivations } from './resolveBindingActivations';

describe(resolveBindingActivations.name, () => {
  describe('having a non promise value', () => {
    let paramsMock: jest.Mocked<ResolutionParams>;
    let serviceIdentifierFixture: ServiceIdentifier;
    let valueFixture: unknown;

    beforeAll(() => {
      paramsMock = {
        getActivations: jest.fn(),
      } as Partial<
        jest.Mocked<ResolutionParams>
      > as jest.Mocked<ResolutionParams>;
      serviceIdentifierFixture = 'service-id';
      valueFixture = Symbol();
    });

    describe('when called, and params.getActivations() returns undefined', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveBindingActivations(
          paramsMock,
          serviceIdentifierFixture,
          valueFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getActivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getActivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return value', () => {
        expect(result).toBe(valueFixture);
      });
    });

    describe('when called, and params.getActivations() returns sync activations', () => {
      let activationMock: jest.Mock<BindingActivation>;
      let activationResult: unknown;

      let result: unknown;

      beforeAll(() => {
        activationResult = Symbol('activation-result');

        activationMock = jest.fn().mockReturnValueOnce(activationResult);

        paramsMock.getActivations.mockReturnValueOnce([activationMock]);

        result = resolveBindingActivations(
          paramsMock,
          serviceIdentifierFixture,
          valueFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getActivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getActivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call activation', () => {
        expect(activationMock).toHaveBeenCalledTimes(1);
        expect(activationMock).toHaveBeenCalledWith(valueFixture);
      });

      it('should return value', () => {
        expect(result).toBe(activationResult);
      });
    });

    describe('when called, and params.getActivations() returns async activations', () => {
      let activationMock: jest.Mock<BindingActivation>;
      let activationResult: unknown;

      let result: unknown;

      beforeAll(async () => {
        activationResult = Symbol('activation-result');

        activationMock = jest
          .fn()
          .mockReturnValueOnce(Promise.resolve(activationResult));

        paramsMock.getActivations.mockReturnValueOnce([activationMock]);

        result = await resolveBindingActivations(
          paramsMock,
          serviceIdentifierFixture,
          valueFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getActivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getActivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call activation', () => {
        expect(activationMock).toHaveBeenCalledTimes(1);
        expect(activationMock).toHaveBeenCalledWith(valueFixture);
      });

      it('should return value', () => {
        expect(result).toBe(activationResult);
      });
    });
  });

  describe('having a promise value', () => {
    let paramsMock: jest.Mocked<ResolutionParams>;
    let serviceIdentifierFixture: ServiceIdentifier;
    let valueFixture: unknown;

    beforeAll(() => {
      paramsMock = {
        getActivations: jest.fn(),
      } as Partial<
        jest.Mocked<ResolutionParams>
      > as jest.Mocked<ResolutionParams>;
      serviceIdentifierFixture = 'service-id';
      valueFixture = Symbol();
    });

    describe('when called, and params.getActivations() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await resolveBindingActivations(
          paramsMock,
          serviceIdentifierFixture,
          Promise.resolve(valueFixture),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getActivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getActivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return value', () => {
        expect(result).toBe(valueFixture);
      });
    });

    describe('when called, and params.getActivations() returns sync activations', () => {
      let activationMock: jest.Mock<BindingActivation>;
      let activationResult: unknown;

      let result: unknown;

      beforeAll(async () => {
        activationResult = Symbol('activation-result');

        activationMock = jest.fn().mockReturnValueOnce(activationResult);

        paramsMock.getActivations.mockReturnValueOnce([activationMock]);

        result = await resolveBindingActivations(
          paramsMock,
          serviceIdentifierFixture,
          Promise.resolve(valueFixture),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getActivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getActivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call activation', () => {
        expect(activationMock).toHaveBeenCalledTimes(1);
        expect(activationMock).toHaveBeenCalledWith(valueFixture);
      });

      it('should return value', () => {
        expect(result).toBe(activationResult);
      });
    });

    describe('when called, and params.getActivations() returns async activations', () => {
      let activationMock: jest.Mock<BindingActivation>;
      let activationResult: unknown;

      let result: unknown;

      beforeAll(async () => {
        activationResult = Symbol('activation-result');

        activationMock = jest
          .fn()
          .mockReturnValueOnce(Promise.resolve(activationResult));

        paramsMock.getActivations.mockReturnValueOnce([activationMock]);

        result = await resolveBindingActivations(
          paramsMock,
          serviceIdentifierFixture,
          Promise.resolve(valueFixture),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getActivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getActivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call activation', () => {
        expect(activationMock).toHaveBeenCalledTimes(1);
        expect(activationMock).toHaveBeenCalledWith(valueFixture);
      });

      it('should return value', () => {
        expect(result).toBe(activationResult);
      });
    });
  });
});
