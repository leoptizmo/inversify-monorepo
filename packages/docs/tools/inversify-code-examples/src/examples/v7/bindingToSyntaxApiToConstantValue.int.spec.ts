import { describe, expect, it } from '@jest/globals';

import { Katana, katana } from './bindingToSyntaxApiToConstantValue';

describe('BindingToSyntax API (toConstantValue)', () => {
  it('should bind Katana weapon', () => {
    expect(katana).toBeInstanceOf(Katana);
  });
});
