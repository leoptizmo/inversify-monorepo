import assert from 'node:assert';

import { Then } from '@cucumber/cucumber';

import { InversifyHttpWorld } from '../../../common/models/InversifyHttpWorld';
import { getServerResponseOrFail } from '../../../server/calculations/getServerResponseOrFail';

async function thenResponseStatusCodeIsForbidden(
  this: InversifyHttpWorld,
  responseAlias?: string,
): Promise<void> {
  const parsedResponseAlias: string = responseAlias ?? 'default';

  const response: Response =
    getServerResponseOrFail.bind(this)(parsedResponseAlias);

  assert.strictEqual(
    response.status,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    403,
    `Expected status code to be 403, but got ${String(response.status)}`,
  );
}

Then<InversifyHttpWorld>(
  'the response status code is FORBIDDEN',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseStatusCodeIsForbidden.bind(this)();
  },
);
