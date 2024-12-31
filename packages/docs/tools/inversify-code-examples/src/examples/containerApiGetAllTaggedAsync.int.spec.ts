import { describe, expect, it } from '@jest/globals';

import { es, fr } from './containerApiGetAllTaggedAsync';

describe('Container API (getAllTaggedAsync)', () => {
  it('should provide translations', async () => {
    expect(await es).toStrictEqual([{ hello: 'hola' }, { goodbye: 'adios' }]);
    expect(await fr).toStrictEqual([
      { hello: 'bonjour' },
      { goodbye: 'au revoir' },
    ]);
  });
});
