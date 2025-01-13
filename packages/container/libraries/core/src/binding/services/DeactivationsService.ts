import { ServiceIdentifier } from '@inversifyjs/common';

import { chain } from '../../common/calculations/chain';
import { Cloneable } from '../../common/models/Cloneable';
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

export class DeactivationsService implements Cloneable<DeactivationsService> {
  readonly #deactivationMaps: OneToManyMapStar<
    BindingDeactivation,
    BindingDeactivationRelation
  >;

  readonly #parent: DeactivationsService | undefined;

  private constructor(
    parent: DeactivationsService | undefined,
    deactivationMaps?: OneToManyMapStar<
      BindingDeactivation,
      BindingDeactivationRelation
    >,
  ) {
    this.#deactivationMaps =
      deactivationMaps ??
      new OneToManyMapStar<BindingDeactivation, BindingDeactivationRelation>({
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
    parent: DeactivationsService | undefined,
  ): DeactivationsService {
    return new DeactivationsService(parent);
  }

  public add(
    deactivation: BindingDeactivation,
    relation: BindingDeactivationRelation,
  ): void {
    this.#deactivationMaps.add(deactivation, relation);
  }

  public clone(): DeactivationsService {
    const clone: DeactivationsService = new DeactivationsService(
      this.#parent,
      this.#deactivationMaps.clone(),
    );

    return clone;
  }

  public get(
    serviceIdentifier: ServiceIdentifier,
  ): Iterable<BindingDeactivation> | undefined {
    const deactivationIterables: Iterable<BindingDeactivation>[] = [];

    const deactivations: Iterable<BindingDeactivation> | undefined =
      this.#deactivationMaps.get(
        DeactivationRelationKind.serviceId,
        serviceIdentifier,
      );

    if (deactivations !== undefined) {
      deactivationIterables.push(deactivations);
    }

    const parentDeactivations: Iterable<BindingDeactivation> | undefined =
      this.#parent?.get(serviceIdentifier);

    if (parentDeactivations !== undefined) {
      deactivationIterables.push(parentDeactivations);
    }

    if (deactivationIterables.length === 0) {
      return undefined;
    }

    return chain(...deactivationIterables);
  }

  public removeAllByModuleId(moduleId: number): void {
    this.#deactivationMaps.removeByRelation(
      DeactivationRelationKind.moduleId,
      moduleId,
    );
  }

  public removeAllByServiceId(serviceId: ServiceIdentifier): void {
    this.#deactivationMaps.removeByRelation(
      DeactivationRelationKind.serviceId,
      serviceId,
    );
  }
}
