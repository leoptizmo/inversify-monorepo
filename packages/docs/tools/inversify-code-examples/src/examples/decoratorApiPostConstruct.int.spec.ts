import { describe, expect, it } from '@jest/globals';

import { katana } from './decoratorApiPostConstruct';

describe('Decorator API (postConstruct)', () => {
  it('should provide activated service', () => {
    expect(katana.damage).toBe(12);
  });
});
