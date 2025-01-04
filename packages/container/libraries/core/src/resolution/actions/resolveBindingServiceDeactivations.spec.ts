import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ServiceIdentifier } from '@inversifyjs/common';

import { BindingDeactivation } from '../../binding/models/BindingDeactivation';
import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingServiceDeactivations } from './resolveBindingServiceDeactivations';

describe(resolveBindingServiceDeactivations.name, () => {
  describe('having a non promise value', () => {
    let paramsMock: jest.Mocked<DeactivationParams>;
    let serviceIdentifierFixture: ServiceIdentifier;
    let valueFixture: unknown;

    beforeAll(() => {
      paramsMock = {
        getBindings: jest.fn(),
        getDeactivations: jest.fn(),
      } as Partial<
        jest.Mocked<DeactivationParams>
      > as jest.Mocked<DeactivationParams>;
      serviceIdentifierFixture = 'service-id';
      valueFixture = Symbol();
    });

    describe('when called, and params.getActivations() returns undefined', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveBindingServiceDeactivations(
          paramsMock,
          serviceIdentifierFixture,
          valueFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getDeactivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getDeactivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and params.getActivations() returns sync activations', () => {
      let deactivationMock: jest.Mock<BindingDeactivation>;

      let result: unknown;

      beforeAll(() => {
        deactivationMock = jest.fn();
        deactivationMock.mockReturnValueOnce(undefined);

        paramsMock.getDeactivations.mockReturnValueOnce([deactivationMock]);

        result = resolveBindingServiceDeactivations(
          paramsMock,
          serviceIdentifierFixture,
          valueFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getDeactivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getDeactivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call activation', () => {
        expect(deactivationMock).toHaveBeenCalledTimes(1);
        expect(deactivationMock).toHaveBeenCalledWith(valueFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and params.getActivations() returns async activations', () => {
      let deactivationMock: jest.Mock<BindingDeactivation>;

      let result: unknown;

      beforeAll(async () => {
        deactivationMock = jest.fn();
        deactivationMock.mockReturnValueOnce(Promise.resolve(undefined));

        paramsMock.getDeactivations.mockReturnValueOnce([deactivationMock]);

        result = await resolveBindingServiceDeactivations(
          paramsMock,
          serviceIdentifierFixture,
          valueFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getDeactivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getDeactivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call activation', () => {
        expect(deactivationMock).toHaveBeenCalledTimes(1);
        expect(deactivationMock).toHaveBeenCalledWith(valueFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a promise value', () => {
    let paramsMock: jest.Mocked<DeactivationParams>;
    let serviceIdentifierFixture: ServiceIdentifier;
    let valueFixture: unknown;

    beforeAll(() => {
      paramsMock = {
        getBindings: jest.fn(),
        getDeactivations: jest.fn(),
      } as Partial<
        jest.Mocked<DeactivationParams>
      > as jest.Mocked<DeactivationParams>;
      serviceIdentifierFixture = 'service-id';
      valueFixture = Symbol();
    });

    describe('when called, and params.getActivations() returns undefined', () => {
      let result: unknown;

      beforeAll(async () => {
        result = await resolveBindingServiceDeactivations(
          paramsMock,
          serviceIdentifierFixture,
          Promise.resolve(valueFixture),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getDeactivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getDeactivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and params.getActivations() returns sync activations', () => {
      let deactivationMock: jest.Mock<BindingDeactivation>;

      let result: unknown;

      beforeAll(async () => {
        deactivationMock = jest.fn();
        deactivationMock.mockReturnValueOnce(undefined);

        paramsMock.getDeactivations.mockReturnValueOnce([deactivationMock]);

        result = await resolveBindingServiceDeactivations(
          paramsMock,
          serviceIdentifierFixture,
          Promise.resolve(valueFixture),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getDeactivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getDeactivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call activation', () => {
        expect(deactivationMock).toHaveBeenCalledTimes(1);
        expect(deactivationMock).toHaveBeenCalledWith(valueFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and params.getActivations() returns async activations', () => {
      let deactivationMock: jest.Mock<BindingDeactivation>;

      let result: unknown;

      beforeAll(async () => {
        deactivationMock = jest.fn();
        deactivationMock.mockReturnValueOnce(Promise.resolve(undefined));

        paramsMock.getDeactivations.mockReturnValueOnce([deactivationMock]);

        result = await resolveBindingServiceDeactivations(
          paramsMock,
          serviceIdentifierFixture,
          Promise.resolve(valueFixture),
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call params.getActivations', () => {
        expect(paramsMock.getDeactivations).toHaveBeenCalledTimes(1);
        expect(paramsMock.getDeactivations).toHaveBeenCalledWith(
          serviceIdentifierFixture,
        );
      });

      it('should call activation', () => {
        expect(deactivationMock).toHaveBeenCalledTimes(1);
        expect(deactivationMock).toHaveBeenCalledWith(valueFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
