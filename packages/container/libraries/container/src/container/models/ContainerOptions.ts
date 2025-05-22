import { BindingScope } from '@gritcode/inversifyjs-core';

import { Container } from '../services/Container';

export interface ContainerOptions {
  autobind?: true;
  defaultScope?: BindingScope | undefined;
  parent?: Container | undefined;
}
