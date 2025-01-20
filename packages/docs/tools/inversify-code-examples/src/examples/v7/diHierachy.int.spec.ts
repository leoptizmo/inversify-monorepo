import { describe, expect, it } from '@jest/globals';

import { Katana, katana } from './diHierarchy';

describe('DI Hierachy', () => {
  it('should provide a Katana', () => {
    expect(katana).toBeInstanceOf(Katana);
  });
});
