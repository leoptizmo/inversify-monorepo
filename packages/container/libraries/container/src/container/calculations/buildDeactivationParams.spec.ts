import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mocked,
  vitest,
} from 'vitest';

vitest.mock('@gritcode/inversifyjs-core');

import {
  BindingService,
  DeactivationParams,
  DeactivationsService,
  getClassMetadata,
} from '@gritcode/inversifyjs-core';

import { ServiceReferenceManager } from '../services/ServiceReferenceManager';
import { buildDeactivationParams } from './buildDeactivationParams';

describe(buildDeactivationParams, () => {
  let serviceReferenceManagerMock: ServiceReferenceManager;

  beforeAll(() => {
    serviceReferenceManagerMock = {
      bindingService: {
        get: vitest.fn(),
        getByModuleId: vitest.fn(),
      } as Partial<Mocked<BindingService>> as Mocked<BindingService>,
      deactivationService: {
        get: vitest.fn(),
      } as Partial<
        Mocked<DeactivationsService>
      > as Mocked<DeactivationsService>,
    } as Partial<
      Mocked<ServiceReferenceManager>
    > as Mocked<ServiceReferenceManager>;
  });

  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = buildDeactivationParams(serviceReferenceManagerMock);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should return the expected result', () => {
      const expected: Mocked<DeactivationParams> = {
        getBindings: expect.any(Function),
        getBindingsFromModule: expect.any(Function),
        getClassMetadata: vitest.mocked(getClassMetadata),
        getDeactivations: expect.any(Function),
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
