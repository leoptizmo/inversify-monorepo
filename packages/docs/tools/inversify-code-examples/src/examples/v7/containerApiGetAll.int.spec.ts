import { describe, expect, it } from '@jest/globals';

import { Katana, Shuriken, weapons } from './containerApiGetAll';

describe('Container API (getAll)', () => {
  it('should provide weapons', () => {
    expect(weapons).toStrictEqual([new Katana(), new Shuriken()]);
  });
});
