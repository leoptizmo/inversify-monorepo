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

  assert(
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    responseStatus >= 200 && responseStatus < 300,
    `Status code is not Ok-ish: ${String(responseStatus)}`,
  );
}

Then<InversifyHttpWorld>(
  'the response status code is Ok-ish',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseStatusCodeIsOkIsh.bind(this)();
  },
);
