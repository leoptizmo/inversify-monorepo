import { describe, expect, it } from 'vitest';

import { container, scriptExecution } from './containerApiUnbindBindingId';

describe('ContainerAPI (unbind)', () => {
  it('should provide expected service', async () => {
    await scriptExecution;

    expect(container.isBound('MyService')).toBe(false);
  });
});
