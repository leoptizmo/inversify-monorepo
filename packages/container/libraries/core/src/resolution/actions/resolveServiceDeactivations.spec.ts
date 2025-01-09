import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ServiceIdentifier } from '@inversifyjs/common';

jest.mock('./resolveBindingDeactivations');

import { ConstantValueBindingFixtures } from '../../binding/fixtures/ConstantValueBindingFixtures';
import { ConstantValueBinding } from '../../binding/models/ConstantValueBinding';
import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingDeactivations } from './resolveBindingDeactivations';
import { resolveServiceDeactivations } from './resolveServiceDeactivations';

describe(resolveServiceDeactivations.name, () => {
  let paramsMock: jest.Mocked<DeactivationParams>;
  let serviceIdentifierFixture: ServiceIdentifier;

  beforeAll(() => {
    paramsMock = {
      getBindings: jest.fn() as unknown,
      getClassMetadata: jest.fn(),
      getDeactivations: jest.fn(),
    } as Partial<
      jest.Mocked<DeactivationParams>
    > as jest.Mocked<DeactivationParams>;
    serviceIdentifierFixture = 'service-id';
  });

  describe('when called, and params.getBindings() returns undefined', () => {
    let result: unknown;

    beforeAll(() => {
      result = resolveServiceDeactivations(
        paramsMock,
        serviceIdentifierFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call params.getBindings()', () => {
      expect(paramsMock.getBindings).toHaveBeenCalledTimes(1);
      expect(paramsMock.getBindings).toHaveBeenCalledWith(
        serviceIdentifierFixture,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and params.getBindings() returns an array with singleton ScopedBinding with no cached value', () => {
    let result: unknown;

    beforeAll(() => {
      paramsMock.getBindings.mockReturnValueOnce([
        ConstantValueBindingFixtures.withCacheWithIsRightFalse,
      ]);

      result = resolveServiceDeactivations(
        paramsMock,
        serviceIdentifierFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call params.getBindings()', () => {
      expect(paramsMock.getBindings).toHaveBeenCalledTimes(1);
      expect(paramsMock.getBindings).toHaveBeenCalledWith(
        serviceIdentifierFixture,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and params.getBindings() returns an array with non instance singleton ScopedBinding with cached value', () => {
    let bindingFixture: ConstantValueBinding<unknown>;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = ConstantValueBindingFixtures.withCacheWithIsRightTrue;

      paramsMock.getBindings.mockReturnValueOnce([bindingFixture]);

      result = resolveServiceDeactivations(
        paramsMock,
        serviceIdentifierFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call params.getBindings()', () => {
      expect(paramsMock.getBindings).toHaveBeenCalledTimes(1);
      expect(paramsMock.getBindings).toHaveBeenCalledWith(
        serviceIdentifierFixture,
      );
    });

    it('should call resolveBindingDeactivations()', () => {
      expect(resolveBindingDeactivations).toHaveBeenCalledTimes(1);
      expect(resolveBindingDeactivations).toHaveBeenCalledWith(
        paramsMock,
        bindingFixture,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });

  describe('when called, and params.getBindings() returns an array with non instance singleton ScopedBinding with cached value and resolveBindingDeactivations() returns Promise', () => {
    let bindingFixture: ConstantValueBinding<unknown>;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = ConstantValueBindingFixtures.withCacheWithIsRightTrue;

      paramsMock.getBindings.mockReturnValueOnce([bindingFixture]);

      (
        resolveBindingDeactivations as jest.Mock<
          typeof resolveBindingDeactivations
        >
      ).mockReturnValueOnce(Promise.resolve(undefined));

      result = resolveServiceDeactivations(
        paramsMock,
        serviceIdentifierFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call params.getBindings()', () => {
      expect(paramsMock.getBindings).toHaveBeenCalledTimes(1);
      expect(paramsMock.getBindings).toHaveBeenCalledWith(
        serviceIdentifierFixture,
      );
    });

    it('should call resolveBindingDeactivations()', () => {
      expect(resolveBindingDeactivations).toHaveBeenCalledTimes(1);
      expect(resolveBindingDeactivations).toHaveBeenCalledWith(
        paramsMock,
        bindingFixture,
      );
    });

    it('should return undefined', () => {
      expect(result).toStrictEqual(Promise.resolve(undefined));
    });
  });
});
