import { describe, expect, it } from '@jest/globals';

import { isSameKatana } from './bindingInSyntaxApiInTransientScope';

describe('BindingInSyntax API (inTransientScope)', () => {
  it('should provide same Katana', () => {
    expect(isSameKatana).toBe(false);
  });
});
