import { ServiceIdentifier } from '@inversifyjs/common';
import { Container } from '@inversifyjs/container';

import { BindingParameterKind } from './BindingParameterKind';

export interface BaseBindingParameter<TKind extends BindingParameterKind> {
  bind: (container: Container) => void;
  kind: TKind;
  serviceIdentifier: ServiceIdentifier;
}
