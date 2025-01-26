import { describe, expect, it } from '@jest/globals';

import { Katana, samurai } from './fundamentalsAutobinding';

describe('Fundamentals: Auto binding', () => {
  it('should provide a katana when resolving a samurai service', () => {
    expect(samurai.katana).toBeInstanceOf(Katana);
  });
});
