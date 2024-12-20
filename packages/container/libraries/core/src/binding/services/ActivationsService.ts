import { ServiceIdentifier } from '@inversifyjs/common';

import { OneToManyMapStar } from '../../common/models/OneToManyMapStar';
import { BindingActivation } from '../models/BindingActivation';

enum ActivationRelationKind {
  moduleId = 'moduleId',
  serviceId = 'serviceId',
}

export interface BindingActivationRelation {
  [ActivationRelationKind.moduleId]?: number;
  [ActivationRelationKind.serviceId]: ServiceIdentifier;
}

export class ActivationsService {
  readonly #activationMaps: OneToManyMapStar<
    BindingActivation,
    BindingActivationRelation
  >;

  readonly #parent: ActivationsService | undefined;

  constructor(parent: ActivationsService | undefined) {
    this.#activationMaps = new OneToManyMapStar<
      BindingActivation,
      BindingActivationRelation
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
    activation: BindingActivation,
    relation: BindingActivationRelation,
  ): void {
    this.#activationMaps.set(activation, relation);
  }

  public get(
    serviceIdentifier: ServiceIdentifier,
  ): Iterable<BindingActivation> | undefined {
    return (
      this.#activationMaps.get(
        ActivationRelationKind.serviceId,
        serviceIdentifier,
      ) ?? this.#parent?.get(serviceIdentifier)
    );
  }

  public removeAllByModuleId(moduleId: number): void {
    this.#activationMaps.removeByRelation(
      ActivationRelationKind.moduleId,
      moduleId,
    );
  }

  public removeAllByServiceId(serviceId: ServiceIdentifier): void {
    this.#activationMaps.removeByRelation(
      ActivationRelationKind.serviceId,
      serviceId,
    );
  }
}
