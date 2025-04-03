import assert from 'node:assert';

import { Then } from '@cucumber/cucumber';

import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';
import { getServerResponseOrFail } from '../../server/calculations/getServerResponseOrFail';
import { WarriorCreationResponse } from '../models/WarriorCreationResponse';
import { WarriorCreationResponseType } from '../models/WarriorCreationResponseType';
import { WarriorWithId } from '../models/WarriorWithId';
import { WarriorWithQuery } from '../models/WarriorWithQuery';

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

async function thenResponseContainsTheCorrectUrlQueryParametersByName(
  this: InversifyHttpWorld,
  responseAlias?: string,
): Promise<void> {
  const parsedResponseAlias: string = responseAlias ?? 'default';

  const response: Response =
    getServerResponseOrFail.bind(this)(parsedResponseAlias);

  const warriorWithQuery: WarriorWithQuery =
    (await response.json()) as WarriorWithQuery;

  assert.ok(warriorWithQuery.filter === 'test');
}

async function thenResponseContainsTheCorrectHeadersInformation(
  this: InversifyHttpWorld,
  responseAlias?: string,
): Promise<void> {
  const parsedResponseAlias: string = responseAlias ?? 'default';

  const response: Response =
    getServerResponseOrFail.bind(this)(parsedResponseAlias);

  const responseBody: Record<string, string> =
    (await response.json()) as Record<string, string>;

  assert.ok(responseBody['x-test-header'] !== undefined);
  assert.strictEqual(responseBody['x-test-header'], 'test-value');
}

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
  'the response status code is Ok-ish',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseStatusCodeIsOkIsh.bind(this)();
  },
);

Then<InversifyHttpWorld>(
  'the response contains the correct URL parameters',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseContainsTheCorrectUrlParameters.bind(this)();
  },
);

Then<InversifyHttpWorld>(
  'the response contains the correct body data',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseContainsTheCorrectBodyData.bind(this)();
  },
);

Then<InversifyHttpWorld>(
  'the response contains the correct URL query parameters',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseContainsTheCorrectUrlQueryParametersByName.bind(this)();
  },
);

Then<InversifyHttpWorld>(
  'the response contains the correct headers information',
  async function (this: InversifyHttpWorld): Promise<void> {
    await thenResponseContainsTheCorrectHeadersInformation.bind(this)();
  },
);
