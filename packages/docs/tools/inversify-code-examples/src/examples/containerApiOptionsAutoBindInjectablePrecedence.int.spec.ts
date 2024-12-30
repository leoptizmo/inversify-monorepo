import { describe, expect, it } from '@jest/globals';

import {
  container,
  Ninja,
  NinjaMaster,
} from './containerApiOptionsAutoBindInjectablePrecedence';

describe('Container API options (autoBindInjectable, precedence)', () => {
  it('should provide ninja according to manual binding', () => {
    expect(container.get(Ninja)).toBeInstanceOf(NinjaMaster);
  });
});
