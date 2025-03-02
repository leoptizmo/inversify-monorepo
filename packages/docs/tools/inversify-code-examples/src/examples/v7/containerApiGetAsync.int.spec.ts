import { describe, expect, it } from 'vitest';

import { Level1, level1 } from './containerApiGetAsync';

describe('Container API (getAsync)', () => {
  it('should provide async service', async () => {
    expect(await level1).toBeInstanceOf(Level1);
  });
});
