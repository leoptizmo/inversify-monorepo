import { describe, expect, it } from '@jest/globals';

import {
  allWeapons,
  Katana,
  notAllWeapons,
  Shuriken,
} from './containerApiGetAllAsyncEnforced';

describe('Container API (getAllAsync)', () => {
  it('should provide weapons', async () => {
    expect(await allWeapons).toStrictEqual([new Katana(), new Shuriken()]);
    expect(await notAllWeapons).toStrictEqual([new Katana()]);
  });
});
