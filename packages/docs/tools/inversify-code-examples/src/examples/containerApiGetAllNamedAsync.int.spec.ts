import { describe, expect, it } from 'vitest';

import { es, fr } from './containerApiGetAllNamedAsync';

describe('Container API (getAllNamedAsync)', () => {
  it('should provide translations', async () => {
    expect(await es).toStrictEqual([{ hello: 'hola' }, { goodbye: 'adios' }]);
    expect(await fr).toStrictEqual([
      { hello: 'bonjour' },
      { goodbye: 'au revoir' },
    ]);
  });
});
