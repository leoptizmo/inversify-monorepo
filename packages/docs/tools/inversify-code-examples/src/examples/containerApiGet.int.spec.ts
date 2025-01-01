import { describe, expect, it } from '@jest/globals';

import { Katana, katana } from './containerApiGet';

describe('Container API (get)', () => {
  it('should provide Katana weapon', () => {
    expect(katana).toBeInstanceOf(Katana);
  });
});
