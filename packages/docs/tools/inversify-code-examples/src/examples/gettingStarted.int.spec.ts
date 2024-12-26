import { describe, expect, it } from '@jest/globals';

import { ninja } from './gettingStarted';

describe('getting started', () => {
  it('should provide a ninja with a weapon with right damage', () => {
    expect(ninja.weapon.damage).toBe(10);
  });
});
