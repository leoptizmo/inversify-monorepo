import { describe, expect, it } from '@jest/globals';

import { Katana, katanaConstructor } from './bindingToSyntaxApiToConstructor';

describe('BindingToSyntax API (toConstructor)', () => {
  it('should bind Katana weapon constructor', () => {
    expect(katanaConstructor).toBe(Katana);
  });
});
