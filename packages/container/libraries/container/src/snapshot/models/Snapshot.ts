import {
  ActivationsService,
  BindingService,
  DeactivationsService,
} from '@gritcode/inversifyjs-core';

export interface Snapshot {
  activationService: ActivationsService;
  bindingService: BindingService;
  deactivationService: DeactivationsService;
}
