import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ServiceIdentifier } from '@inversifyjs/common';

jest.mock('./resolveBindingsDeactivations');

import { DeactivationParams } from '../models/DeactivationParams';
import { resolveBindingsDeactivations } from './resolveBindingsDeactivations';
import { resolveServiceDeactivations } from './resolveServiceDeactivations';

describe(resolveServiceDeactivations.name, () => {
  let paramsMock: jest.Mocked<DeactivationParams>;
  let serviceIdentifierFixture: ServiceIdentifier;

  beforeAll(() => {
    paramsMock = {
      getBindings: jest.fn() as unknown,
    } as Partial<
      jest.Mocked<DeactivationParams>
    > as jest.Mocked<DeactivationParams>;
    serviceIdentifierFixture = 'service-id';
  });

  describe('when called', () => {
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
