import { describe, expect, it } from '@jest/globals';

import {
  isBoundAfterGet,
  isBoundBeforeGet,
} from './containerApiOptionsAutoBindInjectable';

describe('Container API options (autoBindInjectable)', () => {
  it('should auto bind ninja', () => {
    expect(isBoundAfterGet).toBe(true);
    expect(isBoundBeforeGet).toBe(false);
  });
});
