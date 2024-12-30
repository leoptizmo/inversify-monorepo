import { describe, expect, it } from '@jest/globals';

import { Katana, katana, Shuriken, shuriken } from './containerApiGetTagged';

describe('Container API (getTagged)', () => {
  it('should provide weapon services', () => {
    expect(katana).toBeInstanceOf(Katana);
    expect(shuriken).toBeInstanceOf(Shuriken);
  });
});
