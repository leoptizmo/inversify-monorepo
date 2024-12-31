import { describe, expect, it } from '@jest/globals';

import {
  isDivisorBoundInInvalidDivisorName,
  isDivisorBoundInValidDivisorName,
} from './containerApiIsBoundNamed';

describe('Container API (isCurrentBoundNamed)', () => {
  it('should detect bound and not bound services', async () => {
    expect(isDivisorBoundInInvalidDivisorName).toBe(true);
    expect(isDivisorBoundInValidDivisorName).toBe(true);
  });
});
