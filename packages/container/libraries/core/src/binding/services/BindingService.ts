import { ServiceIdentifier } from '@inversifyjs/common';

import { Cloneable } from '../../common/models/Cloneable';
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

export class BindingService implements Cloneable<BindingService> {
  readonly #bindingMaps: OneToManyMapStar<Binding<unknown>, BindingRelation>;
  readonly #parent: BindingService | undefined;

  private constructor(
    parent: BindingService | undefined,
    bindingMaps?: OneToManyMapStar<Binding<unknown>, BindingRelation>,
  ) {
    this.#bindingMaps =
      bindingMaps ??
      new OneToManyMapStar<Binding<unknown>, BindingRelation>({
        moduleId: {
          isOptional: true,
        },
        serviceId: {
          isOptional: false,
        },
      });

    this.#parent = parent;
  }

  public static build(parent: BindingService | undefined): BindingService {
    return new BindingService(parent);
  }

  public clone(): BindingService {
    const clone: BindingService = new BindingService(
      this.#parent,
      this.#bindingMaps.clone(),
    );

    return clone;
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

  public getNonParentBoundServices(): Iterable<ServiceIdentifier> {
    return this.#bindingMaps.getAllKeys(BindingRelationKind.serviceId);
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
