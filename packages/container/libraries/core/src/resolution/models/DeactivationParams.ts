import { ServiceIdentifier } from '@inversifyjs/common';

import { BindingDeactivation } from '../../binding/models/BindingDeactivation';

export interface DeactivationParams {
  getDeactivations: <TActivated>(
    serviceIdentifier: ServiceIdentifier<TActivated>,
  ) => Iterable<BindingDeactivation<TActivated>> | undefined;
}
