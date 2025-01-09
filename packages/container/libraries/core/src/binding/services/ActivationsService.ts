import { ServiceIdentifier } from '@inversifyjs/common';

import { chain } from '../../common/calculations/chain';
import { Cloneable } from '../../common/models/Cloneable';
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

export class ActivationsService implements Cloneable<ActivationsService> {
  readonly #activationMaps: OneToManyMapStar<
    BindingActivation,
    BindingActivationRelation
  >;

  readonly #parent: ActivationsService | undefined;

  private constructor(
    parent: ActivationsService | undefined,
    activationMaps?: OneToManyMapStar<
      BindingActivation,
      BindingActivationRelation
    >,
  ) {
    this.#activationMaps =
      activationMaps ??
      new OneToManyMapStar<BindingActivation, BindingActivationRelation>({
        moduleId: {
          isOptional: true,
        },
        serviceId: {
          isOptional: false,
        },
      });

    this.#parent = parent;
  }

  public static build(
    parent: ActivationsService | undefined,
  ): ActivationsService {
    return new ActivationsService(parent);
  }

  public add(
    activation: BindingActivation,
    relation: BindingActivationRelation,
  ): void {
    this.#activationMaps.set(activation, relation);
  }

  public clone(): ActivationsService {
    const clone: ActivationsService = new ActivationsService(
      this.#parent,
      this.#activationMaps.clone(),
    );

    return clone;
  }

  public get(
    serviceIdentifier: ServiceIdentifier,
  ): Iterable<BindingActivation> | undefined {
    const activationIterables: Iterable<BindingActivation>[] = [];

    const activations: Iterable<BindingActivation> | undefined =
      this.#activationMaps.get(
        ActivationRelationKind.serviceId,
        serviceIdentifier,
      );

    if (activations !== undefined) {
      activationIterables.push(activations);
    }

    const parentActivations: Iterable<BindingActivation> | undefined =
      this.#parent?.get(serviceIdentifier);

    if (parentActivations !== undefined) {
      activationIterables.push(parentActivations);
    }

    if (activationIterables.length === 0) {
      return undefined;
    }

    return chain(...activationIterables);
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
