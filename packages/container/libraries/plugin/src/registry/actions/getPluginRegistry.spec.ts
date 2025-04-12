import { beforeAll, describe, expect, it } from 'vitest';

import { Plugin } from '../../plugin/models/Plugin';
import { getPluginRegistry } from './getPluginRegistry';

describe(getPluginRegistry.name, () => {
  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = getPluginRegistry();
    });

    it('should return a Map', () => {
      expect(result).toStrictEqual(new Map());
    });
  });

  describe('having a defined global registry', () => {
    let getPluginRegistryFixture: Map<symbol, Plugin>;

    beforeAll(() => {
      getPluginRegistryFixture = new Map();

      globalThis.__INVERSIFY_PLUGIN_REGISTRY = getPluginRegistryFixture;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = getPluginRegistry();
      });

      it('should return a Map', () => {
        expect(result).toBe(getPluginRegistryFixture);
      });
    });
  });
});
