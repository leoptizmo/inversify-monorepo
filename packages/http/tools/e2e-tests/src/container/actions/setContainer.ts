import { Container } from '@inversifyjs/container';

import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';

export function setContainer(
  this: InversifyHttpWorld,
  alias: string,
  container: Container,
): void {
  this.entities.containers.set(alias, container);
}
