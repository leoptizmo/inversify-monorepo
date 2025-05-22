import { BindingIdentifier, Container } from '@gritcode/inversifyjs-container';
import { ServiceIdentifier } from '@inversifyjs/common';

import { BindingParameterKind } from './BindingParameterKind';

export interface BaseBindingParameter<TKind extends BindingParameterKind> {
  bind: (container: Container) => BindingIdentifier;
  kind: TKind;
  serviceIdentifier: ServiceIdentifier;
}
