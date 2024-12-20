import { ServiceIdentifier } from '@inversifyjs/common';

import { OneToManyMapStar } from '../../common/models/OneToManyMapStar';
import { BindingDeactivation } from '../models/BindingDeactivation';

enum DeactivationRelationKind {
  moduleId = 'moduleId',
  serviceId = 'serviceId',
}

export interface BindingDeactivationRelation {
  [DeactivationRelationKind.moduleId]?: number;
  [DeactivationRelationKind.serviceId]: ServiceIdentifier;
}

export class DeactivationsService {
  readonly #activationMaps: OneToManyMapStar<
    BindingDeactivation,
    BindingDeactivationRelation
  >;

  readonly #parent: DeactivationsService | undefined;

  constructor(parent: DeactivationsService | undefined) {
    this.#activationMaps = new OneToManyMapStar<
      BindingDeactivation,
      BindingDeactivationRelation
    >({
      moduleId: {
        isOptional: true,
      },
      serviceId: {
        isOptional: false,
      },
    });

    this.#parent = parent;
  }

  public add(
    deactivation: BindingDeactivation,
    relation: BindingDeactivationRelation,
  ): void {
    this.#activationMaps.set(deactivation, relation);
  }

  public get(
    serviceIdentifier: ServiceIdentifier,
  ): Iterable<BindingDeactivation> | undefined {
    return (
      this.#activationMaps.get(
        DeactivationRelationKind.serviceId,
        serviceIdentifier,
      ) ?? this.#parent?.get(serviceIdentifier)
    );
  }

  public removeAllByModuleId(moduleId: number): void {
    this.#activationMaps.removeByRelation(
      DeactivationRelationKind.moduleId,
      moduleId,
    );
  }

  public removeAllByServiceId(serviceId: ServiceIdentifier): void {
    this.#activationMaps.removeByRelation(
      DeactivationRelationKind.serviceId,
      serviceId,
    );
  }
}
