import assert from 'node:assert';

import { Then } from '@cucumber/cucumber';

import { InversifyHttpWorld } from '../../../common/models/InversifyHttpWorld';
import { getServerResponseOrFail } from '../../../server/calculations/getServerResponseOrFail';

async function thenResponseStatusCodeIsOkIsh(
  this: InversifyHttpWorld,
  responseAlias?: string,
): Promise<void> {
  const parsedResponseAlias: string = responseAlias ?? 'default';
  const response: Response =
    getServerResponseOrFail.bind(this)(parsedResponseAlias);
  const responseStatus: number = response.status;

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  assert(responseStatus >= 200 && responseStatus < 300);
}

Then<InversifyHttpWorld>(
  'the response status code is Ok-ish',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseStatusCodeIsOkIsh.bind(this)();
  },
);
