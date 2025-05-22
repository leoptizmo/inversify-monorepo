import { Given } from '@cucumber/cucumber';
import { Container } from '@gritcode/inversifyjs-container';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyWorld } from '../../common/models/InversifyWorld';
import { setContainer } from '../actions/setContainer';

function givenContainer(this: InversifyWorld, containerAlias?: string): void {
  const alias: string = containerAlias ?? defaultAlias;

  setContainer.bind(this)(alias, new Container());
}

Given<InversifyWorld>('a container', function (): void {
  givenContainer.bind(this)();
});
