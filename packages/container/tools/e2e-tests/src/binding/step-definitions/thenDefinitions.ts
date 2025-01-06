import assert from 'node:assert/strict';

import { Then } from '@cucumber/cucumber';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyWorld } from '../../common/models/InversifyWorld';
import { getContainerOrFail } from '../../container/calculations/getContainerOrFail';
import { getBindingOrFail } from '../calculations/getContainerOrFail';

function thenContainerAcknowledgesBindingToBeBound(
  this: InversifyWorld,
  bindingAlias?: string,
  containerAlias?: string,
): void {
  const parsedBindingAlias: string = bindingAlias ?? defaultAlias;
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;

  assert.ok(
    getContainerOrFail
      .bind(this)(parsedContainerAlias)
      .isBound(
        getBindingOrFail.bind(this)(parsedBindingAlias).serviceIdentifier,
      ),
  );
}

Then<InversifyWorld>(
  'container acknowledges binding to be bound',
  function (): void {
    thenContainerAcknowledgesBindingToBeBound.bind(this);
  },
);
