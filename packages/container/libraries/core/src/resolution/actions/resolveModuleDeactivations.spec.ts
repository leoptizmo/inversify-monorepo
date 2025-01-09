import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./resolveBindingsDeactivations');

import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingsDeactivations } from './resolveBindingsDeactivations';
import { resolveModuleDeactivations } from './resolveModuleDeactivations';

describe(resolveModuleDeactivations.name, () => {
  let paramsMock: jest.Mocked<DeactivationParams>;
  let moduleIdFixture: number;

  beforeAll(() => {
    paramsMock = {
      getBindingsFromModule: jest.fn() as unknown,
    } as Partial<
      jest.Mocked<DeactivationParams>
    > as jest.Mocked<DeactivationParams>;
    moduleIdFixture = 2;
  });

  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = resolveModuleDeactivations(paramsMock, moduleIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call params.getBindingsFromModule()', () => {
      expect(paramsMock.getBindingsFromModule).toHaveBeenCalledTimes(1);
      expect(paramsMock.getBindingsFromModule).toHaveBeenCalledWith(
        moduleIdFixture,
      );
    });

    it('should call resolveBindingsDeactivations()', () => {
      expect(resolveBindingsDeactivations).toHaveBeenCalledTimes(1);
      expect(resolveBindingsDeactivations).toHaveBeenCalledWith(
        paramsMock,
        undefined,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
