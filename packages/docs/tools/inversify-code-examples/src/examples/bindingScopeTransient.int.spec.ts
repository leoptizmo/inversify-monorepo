import { describe, expect, it } from '@jest/globals';

import { isSameKatana } from './bindingScopeTransient';

describe('BindingInSyntax API (inTransientScope)', () => {
  it('should provide same Katana', () => {
    expect(isSameKatana).toBe(false);
  });
});
