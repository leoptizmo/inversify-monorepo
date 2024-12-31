import { describe, expect, it } from '@jest/globals';

import { katanaDamageSpy } from './containerApiOnDeactivation';

describe('Container API (onDeactivation)', () => {
  it('should provide activated service', () => {
    expect(katanaDamageSpy).toHaveBeenCalledTimes(1);
    expect(katanaDamageSpy).toHaveBeenCalledWith();
  });
});
