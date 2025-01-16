import { describe, expect, it } from '@jest/globals';

import { isSameKatana } from './bindingScopeSingleton';

describe('BindingInSyntax API (inSingletonScope)', () => {
  it('should provide same Katana', () => {
    expect(isSameKatana).toBe(true);
  });
});
