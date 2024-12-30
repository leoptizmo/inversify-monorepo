import { describe, expect, it } from '@jest/globals';

import {
  Katana,
  katana,
  Shuriken,
  shuriken,
} from './containerApiGetNamedAsync';

describe('Container API (getNamed)', () => {
  it('should provide Katana weapon', async () => {
    expect(await katana).toBeInstanceOf(Katana);
    expect(await shuriken).toBeInstanceOf(Shuriken);
  });
});
