import { IWorld } from '@cucumber/cucumber';
import { Container } from '@inversifyjs/container';

interface EntitiesMap {
  containers: Map<string, Container>;
}

interface ContainerRequests {
  get: Map<string, unknown>;
}

export interface InversifyHttpWorld extends IWorld {
  readonly containerRequests: ContainerRequests;
  readonly entities: EntitiesMap;
}
