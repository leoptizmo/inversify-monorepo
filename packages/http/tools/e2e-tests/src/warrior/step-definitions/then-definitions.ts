import assert from 'node:assert';

import { Then } from '@cucumber/cucumber';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';
import { getServerResponseOrFail } from '../../server/calculations/getServerResponseOrFail';

function thenResponseStatusCodeIsSuccessful(
  this: InversifyHttpWorld,
  responseAlias?: string,
): void {
  const parsedResponseAlias: string = responseAlias ?? defaultAlias;

  const response: Response =
    getServerResponseOrFail.bind(this)(parsedResponseAlias);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  assert.ok(response.status >= 200 && response.status < 300);
}

Then<InversifyHttpWorld>(
  'the response status code is Ok-ish',
  function (): void {
    thenResponseStatusCodeIsSuccessful.bind(this)();
  },
);
