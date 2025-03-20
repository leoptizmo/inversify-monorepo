import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingIdentifier, Container } from '@inversifyjs/container';

import { BindingParameterKind } from './BindingParameterKind';

export interface BaseBindingParameter<TKind extends BindingParameterKind> {
  bind: (container: Container) => BindingIdentifier;
  kind: TKind;
  serviceIdentifier: ServiceIdentifier;
}
