import { describe, expect, it } from '@jest/globals';

import {
  isDivisorBoundInIsValidDivisorFalseTag,
  isDivisorBoundInIsValidDivisorTrueTag,
} from './containerApiIsBoundTagged';

describe('Container API (isCurrentBoundTagged)', () => {
  it('should detect bound and not bound services', async () => {
    expect(isDivisorBoundInIsValidDivisorFalseTag).toBe(true);
    expect(isDivisorBoundInIsValidDivisorTrueTag).toBe(true);
  });
});
