import { describe, expect, it } from '@jest/globals';

import { isSameKatana, warriorHasSameKatana } from './bindingScopeRequest';

describe('BindingInSyntax API (inSingletonScope)', () => {
  it('should provide same Katana', () => {
    expect(isSameKatana).toBe(false);
    expect(warriorHasSameKatana).toBe(true);
  });
});
