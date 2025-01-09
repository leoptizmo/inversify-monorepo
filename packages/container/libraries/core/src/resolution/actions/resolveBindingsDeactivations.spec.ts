import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./resolveBindingDeactivations');

import { ConstantValueBindingFixtures } from '../../binding/fixtures/ConstantValueBindingFixtures';
import { Binding } from '../../binding/models/Binding';
import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingDeactivations } from './resolveBindingDeactivations';
import { resolveBindingsDeactivations } from './resolveBindingsDeactivations';

describe(resolveBindingsDeactivations.name, () => {
  let paramsMock: jest.Mocked<DeactivationParams>;

  beforeAll(() => {
    paramsMock = {
      getBindings: jest.fn() as unknown,
      getClassMetadata: jest.fn(),
      getDeactivations: jest.fn(),
    } as Partial<
      jest.Mocked<DeactivationParams>
    > as jest.Mocked<DeactivationParams>;
  });

  describe('having undefined bindings', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveBindingsDeactivations(paramsMock, undefined);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having bindings with singleton ScopedBinding with no cached value', () => {
    let bindingsFixture: Iterable<Binding>;

    beforeAll(() => {
      bindingsFixture = [
        ConstantValueBindingFixtures.withCacheWithIsRightFalse,
      ];
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveBindingsDeactivations(paramsMock, bindingsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having bindings with singleton ScopedBinding with cached value', () => {
    let bindingFixture: Binding;
    let bindingsFixture: Iterable<Binding>;

    beforeAll(() => {
      bindingFixture = ConstantValueBindingFixtures.withCacheWithIsRightTrue;
      bindingsFixture = [bindingFixture];
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = resolveBindingsDeactivations(paramsMock, bindingsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
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

    describe('when called, and resolveBindingDeactivations() returns Promise', () => {
      let result: unknown;

      beforeAll(() => {
        (
          resolveBindingDeactivations as jest.Mock<
            typeof resolveBindingDeactivations
          >
        ).mockReturnValueOnce(Promise.resolve(undefined));

        result = resolveBindingsDeactivations(paramsMock, bindingsFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
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
});
