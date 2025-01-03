import { describe, expect, it } from '@jest/globals';

import { derivedProp } from './decoratorApiUnmanaged';

describe('Decorator API (unmanaged)', () => {
  it('should provide an instance with right property value', () => {
    expect(derivedProp).toBe('inherited-value');
  });
});
