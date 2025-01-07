import { When } from '@cucumber/cucumber';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyWorld } from '../../common/models/InversifyWorld';
import { getContainerOrFail } from '../../container/calculations/getContainerOrFail';
import { getBindingOrFail } from '../calculations/getContainerOrFail';

function whenBindingIsBound(
  this: InversifyWorld,
  bindingAlias?: string,
  containerAlias?: string,
): void {
  const parsedBindingAlias: string = bindingAlias ?? defaultAlias;
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;

  getBindingOrFail
    .bind(this)(parsedBindingAlias)
    .bind(getContainerOrFail.bind(this)(parsedContainerAlias));
}

When<InversifyWorld>('binding is bound to container', function (): void {
  whenBindingIsBound.bind(this)();
});

When<InversifyWorld>(
  '{string} binding is bound to container',
  function (bindingAlias: string): void {
    whenBindingIsBound.bind(this)(bindingAlias);
  },
);
