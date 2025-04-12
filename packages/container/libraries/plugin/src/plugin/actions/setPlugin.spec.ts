import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mocked,
  vitest,
} from 'vitest';

vitest.mock('../../registry/actions/getPluginRegistry');

import { getPluginRegistry } from '../../registry/actions/getPluginRegistry';
import { Plugin } from '../models/Plugin';
import { setPlugin } from './setPlugin';

describe(setPlugin.name, () => {
  let handleFixture: symbol;
  let pluginFixture: Plugin;

  beforeAll(() => {
    handleFixture = Symbol();
    pluginFixture = Symbol() as unknown as Plugin;
  });

  describe('when called', () => {
    let globalRegistryMock: Mocked<Map<symbol, Plugin>>;

    let result: unknown;

    beforeAll(() => {
      globalRegistryMock = {
        set: vitest.fn() as unknown,
      } as Partial<Mocked<Map<symbol, Plugin>>> as Mocked<Map<symbol, Plugin>>;

      vitest.mocked(getPluginRegistry).mockReturnValueOnce(globalRegistryMock);

      result = setPlugin(handleFixture, pluginFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getPluginRegistry()', () => {
      expect(getPluginRegistry).toHaveBeenCalledTimes(1);
      expect(getPluginRegistry).toHaveBeenCalledWith();
    });

    it('should call globalRegistry.set()', () => {
      expect(globalRegistryMock.set).toHaveBeenCalledTimes(1);
      expect(globalRegistryMock.set).toHaveBeenCalledWith(
        handleFixture,
        pluginFixture,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
