import { describe, expect, it } from '@jest/globals';

import { ninja } from './containerApiResolve';

describe('Container API (resolve)', () => {
  it('should resolve unbound service', async () => {
    expect(ninja.fight()).toBe('cut!');
  });
});
