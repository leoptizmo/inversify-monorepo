import { describe, expect, it } from '@jest/globals';

import { ninjaWeaponDamage } from './decoratorApiMultiInjectProperty';

describe('Decorator API (multiInject)', () => {
  it('should provide a ninja with a weapon with right damage', () => {
    expect(ninjaWeaponDamage).toBe(10);
  });
});
