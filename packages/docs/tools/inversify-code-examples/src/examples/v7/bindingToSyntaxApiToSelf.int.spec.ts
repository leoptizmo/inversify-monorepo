import { describe, expect, it } from '@jest/globals';

import { Katana, katana } from './bindingToSyntaxApiToSelf';

describe('BindingToSyntax API (toSelf)', () => {
  it('should bind Katana weapon', () => {
    expect(katana).toBeInstanceOf(Katana);
  });
});
