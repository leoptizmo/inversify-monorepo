import {
  ActivationsService,
  BindingService,
  DeactivationsService,
} from '@inversifyjs/core';

export interface Snapshot {
  activationService: ActivationsService;
  bindingService: BindingService;
  deactivationService: DeactivationsService;
}
