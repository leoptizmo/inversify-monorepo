import { describe, expect, it } from '@jest/globals';

import { Katana, weapons } from './containerApiGetAllWithNamedBindings';

describe('Container API (getAll with named binding)', () => {
  it('should provide weapons', async () => {
    expect(weapons).toStrictEqual([new Katana()]);
  });
});
