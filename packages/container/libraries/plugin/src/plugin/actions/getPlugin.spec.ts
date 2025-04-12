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
import { getPlugin } from './getPlugin';

describe(getPlugin.name, () => {
  describe('when called', () => {
    let globalRegistryMock: Mocked<Map<symbol, Plugin>>;
    let pluginFixture: Plugin;

    let result: unknown;

    beforeAll(() => {
      globalRegistryMock = {
        get: vitest.fn(),
      } as Partial<Mocked<Map<symbol, Plugin>>> as Mocked<Map<symbol, Plugin>>;

      pluginFixture = Symbol() as unknown as Plugin;

      vitest.mocked(getPluginRegistry).mockReturnValueOnce(globalRegistryMock);

      globalRegistryMock.get.mockReturnValueOnce(pluginFixture);

      result = getPlugin(Symbol());
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getPluginRegistry()', () => {
      expect(getPluginRegistry).toHaveBeenCalledTimes(1);
      expect(getPluginRegistry).toHaveBeenCalledWith();
    });

    it('should call get()', () => {
      expect(globalRegistryMock.get).toHaveBeenCalledTimes(1);
      expect(globalRegistryMock.get).toHaveBeenCalledWith(expect.any(Symbol));
    });

    it('should return Plugin', () => {
      expect(result).toBe(pluginFixture);
    });
  });
});
