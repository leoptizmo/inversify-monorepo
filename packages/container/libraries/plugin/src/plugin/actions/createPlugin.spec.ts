import { beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('./setPlugin');

import { Plugin } from '../models/Plugin';
import { createPlugin } from './createPlugin';
import { setPlugin } from './setPlugin';

describe(createPlugin.name, () => {
  let pluginFixture: Plugin;

  beforeAll(() => {
    pluginFixture = Symbol() as unknown as Plugin;
  });

  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = createPlugin(pluginFixture);
    });

    it('should call setPlugin()', () => {
      expect(setPlugin).toHaveBeenCalledTimes(1);
      expect(setPlugin).toHaveBeenCalledWith(expect.any(Symbol), pluginFixture);
    });

    it('should return a symbol', () => {
      expect(result).toStrictEqual(expect.any(Symbol));
    });
  });
});
