import { describe, expect, it } from '@jest/globals';

import { Katana, Shuriken, weapons } from './containerApiGetAllAsync';

describe('Container API (getAllAsync)', () => {
  it('should provide weapons', async () => {
    expect(await weapons).toStrictEqual([new Katana(), new Shuriken()]);
  });
});
