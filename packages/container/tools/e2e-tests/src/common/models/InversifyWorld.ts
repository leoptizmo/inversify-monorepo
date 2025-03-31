import { IWorld } from '@cucumber/cucumber';
import { Container } from '@inversifyjs/container';

import { BindingIdentifierParameter } from '../../binding/models/BindingIdentifierParameter';
import { BindingParameter } from '../../binding/models/BindingParameter';

interface EntitiesMap {
  bindingIdentifiers: Map<string, BindingIdentifierParameter>;
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
