import assert from 'node:assert';

import { Then } from '@cucumber/cucumber';

import { InversifyHttpWorld } from '../../../common/models/InversifyHttpWorld';
import { getServerResponseOrFail } from '../../../server/calculations/getServerResponseOrFail';
import { WarriorWithId } from '../models/WarriorWithId';

async function thenResponseContainsTheCorrectUrlParameters(
  this: InversifyHttpWorld,
  responseAlias?: string,
): Promise<void> {
  const parsedResponseAlias: string = responseAlias ?? 'default';

  const response: Response =
    getServerResponseOrFail.bind(this)(parsedResponseAlias);

  const warriorWithId: WarriorWithId = (await response.json()) as WarriorWithId;

  assert(warriorWithId.id === '123');
}

Then<InversifyHttpWorld>(
  'the response contains the correct URL parameters',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseContainsTheCorrectUrlParameters.bind(this)();
  },
);
