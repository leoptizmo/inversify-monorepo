import { IWorld } from '@cucumber/cucumber';
import { Container } from '@inversifyjs/container';

import { BindingParameter } from '../../binding/models/BindingParameter';

interface EntitiesMap {
  bindings: Map<string, BindingParameter>;
  containers: Map<string, Container>;
}

interface ContainerRequests {
  get: Map<string, unknown>;
}

export interface InversifyWorld extends IWorld {
  readonly containerRequests: ContainerRequests;
  readonly entities: EntitiesMap;
}
