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
import { PluginContext } from '@gritcode/inversifyjs-plugin';

import { buildDeactivationParams } from './buildDeactivationParams';

describe(buildDeactivationParams, () => {
  let pluginContextMock: PluginContext;

  beforeAll(() => {
    pluginContextMock = {
      bindingService: {
        get: vitest.fn(),
        getByModuleId: vitest.fn(),
      } as Partial<Mocked<BindingService>> as Mocked<BindingService>,
      deactivationService: {
        get: vitest.fn(),
      } as Partial<
        Mocked<DeactivationsService>
      > as Mocked<DeactivationsService>,
    } as Partial<Mocked<PluginContext>> as Mocked<PluginContext>;
  });

  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = buildDeactivationParams(pluginContextMock);
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
