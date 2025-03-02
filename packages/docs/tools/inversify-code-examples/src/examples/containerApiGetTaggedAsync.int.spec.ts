import { describe, expect, it } from 'vitest';

import {
  Katana,
  katana,
  Shuriken,
  shuriken,
} from './containerApiGetTaggedAsync';

describe('Container API (getTagged)', () => {
  it('should provide weapon services', async () => {
    expect(await katana).toBeInstanceOf(Katana);
    expect(await shuriken).toBeInstanceOf(Shuriken);
  });
});
