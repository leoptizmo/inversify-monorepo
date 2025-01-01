import { describe, expect, it } from '@jest/globals';

import { isSameKatana } from './bindingInSyntaxApiInSingletonScope';

describe('BindingInSyntax API (inSingletonScope)', () => {
  it('should provide same Katana', () => {
    expect(isSameKatana).toBe(true);
  });
});
