import { describe, expect, it } from '@jest/globals';

import {
  isKatanaBound,
  isKatanaSymbolBound,
  isNinjaBound,
  isWarriorSymbolBound,
} from './containerApiIsCurrentBound';

describe('Container API (isCurrentBound)', () => {
  it('should detect bound and not bound services', async () => {
    expect(isKatanaBound).toBe(true);
    expect(isKatanaSymbolBound).toBe(true);
    expect(isNinjaBound).toBe(false);
    expect(isWarriorSymbolBound).toBe(false);
  });
});
