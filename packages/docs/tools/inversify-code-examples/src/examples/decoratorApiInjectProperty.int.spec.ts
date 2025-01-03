import { describe, expect, it } from '@jest/globals';

import { ninjaWeaponDamage } from './decoratorApiInjectProperty';

describe('Decorator API (inject)', () => {
  it('should provide a ninja with a weapon with right damage', () => {
    expect(ninjaWeaponDamage).toBe(10);
  });
});
