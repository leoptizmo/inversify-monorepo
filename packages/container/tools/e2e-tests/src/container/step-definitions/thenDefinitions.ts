import assert from 'node:assert/strict';

import { Then } from '@cucumber/cucumber';

import { InversifyWorld } from '../../common/models/InversifyWorld';
import { getContainerGetRequestOrFail } from '../calculations/getContainerGetRequestOrFail';

function getValues(this: InversifyWorld, valueAliases: string[]): unknown[] {
  return valueAliases.map((valueAlias: string): unknown =>
    getContainerGetRequestOrFail.bind(this)(valueAlias),
  );
}

function thenValuesAreDistinct(
  this: InversifyWorld,
  valueAliases: string[],
): void {
  assert.ok(
    getValues
      .bind(this)(valueAliases)
      .every(
        (value: unknown, index: number, array: unknown[]): boolean =>
          array.at(index - 1) !== value,
      ),
  );
}

function thenValuesAreEqual(
  this: InversifyWorld,
  valueAliases: string[],
): void {
  assert.ok(
    getValues
      .bind(this)(valueAliases)
      .every(
        (value: unknown, index: number, array: unknown[]): boolean =>
          array.at(index - 1) === value,
      ),
  );
}

Then<InversifyWorld>(
  '{stringList} values are distinct',
  function (valueAliases: string[]): void {
    thenValuesAreDistinct.bind(this)(valueAliases);
  },
);

Then<InversifyWorld>(
  '{stringList} values are equal',
  function (valueAliases: string[]): void {
    thenValuesAreEqual.bind(this)(valueAliases);
  },
);
