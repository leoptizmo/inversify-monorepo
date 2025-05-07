import { DeactivationParams, getClassMetadata } from '@inversifyjs/core';

import { ServiceReferenceManager } from '../services/ServiceReferenceManager';

export function buildDeactivationParams(
  serviceReferenceManager: ServiceReferenceManager,
): DeactivationParams {
  return {
    getBindings: serviceReferenceManager.bindingService.get.bind(
      serviceReferenceManager.bindingService,
    ),
    getBindingsFromModule:
      serviceReferenceManager.bindingService.getByModuleId.bind(
        serviceReferenceManager.bindingService,
      ),
    getClassMetadata,
    getDeactivations: serviceReferenceManager.deactivationService.get.bind(
      serviceReferenceManager.deactivationService,
    ),
  };
}
