import assert from 'node:assert';

import { Then } from '@cucumber/cucumber';

import { InversifyHttpWorld } from '../../../common/models/InversifyHttpWorld';
import { getServerResponseOrFail } from '../../../server/calculations/getServerResponseOrFail';
import { WarriorCreationResponse } from '../models/WarriorCreationResponse';
import { WarriorCreationResponseType } from '../models/WarriorCreationResponseType';

async function thenResponseContainsTheCorrectBodyData(
  this: InversifyHttpWorld,
  responseAlias?: string,
): Promise<void> {
  const parsedResponseAlias: string = responseAlias ?? 'default';
  const response: Response =
    getServerResponseOrFail.bind(this)(parsedResponseAlias);

  const warriorCreationResponse: WarriorCreationResponse =
    (await response.json()) as WarriorCreationResponse;

  assert(warriorCreationResponse.name === 'Samurai');
  assert(warriorCreationResponse.type === WarriorCreationResponseType.Melee);
}

Then<InversifyHttpWorld>(
  'the response contains the correct body data',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseContainsTheCorrectBodyData.bind(this)();
  },
);
