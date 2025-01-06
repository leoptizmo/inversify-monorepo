import { IWorld } from '@cucumber/cucumber';
import { Container } from '@inversifyjs/container';

import { BindingParameter } from '../../binding/models/BindingParameter';

export interface EntitiesMap {
  bindings: Map<string, BindingParameter>;
  containers: Map<string, Container>;
}

export interface InversifyWorld extends IWorld {
  readonly entities: EntitiesMap;
}
