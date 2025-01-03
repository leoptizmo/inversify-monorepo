import { describe, expect, it } from '@jest/globals';

import { ninja } from './decoratorApiOptional';

describe('Decorator API (optional)', () => {
  it('should provide a ninja with right weapons', () => {
    expect(ninja.katana.damage).toBe(10);
    expect(ninja.shuriken).toBeUndefined();
  });
});
