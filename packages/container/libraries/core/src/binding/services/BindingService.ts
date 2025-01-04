import { ServiceIdentifier } from '@inversifyjs/common';

import { OneToManyMapStar } from '../../common/models/OneToManyMapStar';
import { Binding } from '../models/Binding';

enum BindingRelationKind {
  moduleId = 'moduleId',
  serviceId = 'serviceId',
}

export interface BindingRelation {
  [BindingRelationKind.moduleId]?: number;
  [BindingRelationKind.serviceId]: ServiceIdentifier;
}

export class BindingService {
  readonly #bindingMaps: OneToManyMapStar<Binding<unknown>, BindingRelation>;

  readonly #parent: BindingService | undefined;

  constructor(parent: BindingService | undefined) {
    this.#bindingMaps = new OneToManyMapStar<Binding<unknown>, BindingRelation>(
      {
        moduleId: {
          isOptional: true,
        },
        serviceId: {
          isOptional: false,
        },
      },
    );

    this.#parent = parent;
  }

  public get<TResolved>(
    serviceIdentifier: ServiceIdentifier,
  ): Iterable<Binding<TResolved>> | undefined {
    return (
      (this.#bindingMaps.get(
        BindingRelationKind.serviceId,
        serviceIdentifier,
      ) as Iterable<Binding<TResolved>> | undefined) ??
      this.#parent?.get(serviceIdentifier)
    );
  }

  public getByModuleId<TResolved>(
    moduleId: number,
  ): Iterable<Binding<TResolved>> | undefined {
    return (
      (this.#bindingMaps.get(BindingRelationKind.moduleId, moduleId) as
        | Iterable<Binding<TResolved>>
        | undefined) ?? this.#parent?.getByModuleId(moduleId)
    );
  }

  public removeAllByModuleId(moduleId: number): void {
    this.#bindingMaps.removeByRelation(BindingRelationKind.moduleId, moduleId);
  }

  public removeAllByServiceId(serviceId: ServiceIdentifier): void {
    this.#bindingMaps.removeByRelation(
      BindingRelationKind.serviceId,
      serviceId,
    );
  }

  public set<TInstance>(binding: Binding<TInstance>): void {
    const relation: BindingRelation = {
      [BindingRelationKind.serviceId]: binding.serviceIdentifier,
    };

    if (binding.moduleId !== undefined) {
      relation[BindingRelationKind.moduleId] = binding.moduleId;
    }

    this.#bindingMaps.set(binding as Binding<unknown>, relation);
  }
}
