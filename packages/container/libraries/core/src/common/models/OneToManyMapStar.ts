import { Cloneable } from './Cloneable';

const NOT_FOUND_INDEX: number = -1;

export type OneToManyMapStartSpec<TRelation extends object> = {
  [TKey in keyof TRelation]: {
    isOptional: undefined extends TRelation[TKey] ? true : false;
  };
};

type RelationToModelMap<TModel, TRelation extends object> = {
  [TKey in keyof TRelation]-?: Map<TRelation[TKey], TModel[]>;
};

/**
 * Data structure able to efficiently manage a set of models related to a set of properties in a one to many relation.
 */
export class OneToManyMapStar<TModel, TRelation extends object>
  implements Cloneable<OneToManyMapStar<TModel, TRelation>>
{
  readonly #modelToRelationMap: Map<TModel, TRelation[]>;
  readonly #relationToModelsMaps: RelationToModelMap<TModel, TRelation>;
  readonly #spec: OneToManyMapStartSpec<TRelation>;

  constructor(spec: OneToManyMapStartSpec<TRelation>) {
    this.#modelToRelationMap = new Map();

    this.#relationToModelsMaps = {} as RelationToModelMap<TModel, TRelation>;

    for (const specProperty of Reflect.ownKeys(spec) as (keyof TRelation)[]) {
      this.#relationToModelsMaps[specProperty] = new Map();
    }

    this.#spec = spec;
  }

  public add(model: TModel, relation: TRelation): void {
    this.#buildOrGetModelArray(model).push(relation);

    for (const relationKey of Reflect.ownKeys(
      relation,
    ) as (keyof TRelation)[]) {
      this.#buildOrGetRelationModelSet(relationKey, relation[relationKey]).push(
        model,
      );
    }
  }

  public clone(): OneToManyMapStar<TModel, TRelation> {
    const properties: (keyof TRelation)[] = Reflect.ownKeys(
      this.#spec,
    ) as (keyof TRelation)[];

    const clone: OneToManyMapStar<TModel, TRelation> = new OneToManyMapStar(
      this.#spec,
    );

    this.#pushEntriesIntoMap(
      this.#modelToRelationMap,
      clone.#modelToRelationMap,
    );

    for (const property of properties) {
      this.#pushEntriesIntoMap(
        this.#relationToModelsMaps[property],
        clone.#relationToModelsMaps[property],
      );
    }

    return clone;
  }

  public get<TKey extends keyof TRelation>(
    key: TKey,
    value: Required<TRelation>[TKey],
  ): Iterable<TModel> | undefined {
    return this.#relationToModelsMaps[key].get(value);
  }

  public getAllKeys<TKey extends keyof TRelation>(
    key: TKey,
  ): Iterable<TRelation[TKey]> {
    return this.#relationToModelsMaps[key].keys();
  }

  public removeByRelation<TKey extends keyof TRelation>(
    key: TKey,
    value: Required<TRelation>[TKey],
  ): void {
    const models: Iterable<TModel> | undefined = this.get(key, value);

    if (models === undefined) {
      return;
    }

    for (const model of models) {
      const relations: TRelation[] | undefined =
        this.#modelToRelationMap.get(model);

      if (relations === undefined) {
        throw new Error('Expecting model relation, none found');
      }

      for (const relation of relations) {
        if (relation[key] === value) {
          this.#removeModelFromRelationMaps(model, relation);
        }
      }

      this.#modelToRelationMap.delete(model);
    }
  }

  #buildOrGetModelArray(model: TModel): TRelation[] {
    let relations: TRelation[] | undefined =
      this.#modelToRelationMap.get(model);

    if (relations === undefined) {
      relations = [];

      this.#modelToRelationMap.set(model, relations);
    }

    return relations;
  }

  #buildOrGetRelationModelSet<TKey extends keyof TRelation>(
    relationKey: TKey,
    relationValue: TRelation[TKey],
  ): TModel[] {
    let modelSet: TModel[] | undefined =
      this.#relationToModelsMaps[relationKey].get(relationValue);

    if (modelSet === undefined) {
      modelSet = [];

      this.#relationToModelsMaps[relationKey].set(relationValue, modelSet);
    }

    return modelSet;
  }

  #pushEntriesIntoMap<TKey, TValue>(
    source: Map<TKey, TValue>,
    target: Map<TKey, TValue>,
  ): void {
    for (const [key, value] of source) {
      target.set(key, value);
    }
  }

  #removeModelFromRelationMaps(model: TModel, relation: TRelation): void {
    for (const relationKey of Reflect.ownKeys(
      relation,
    ) as (keyof TRelation)[]) {
      this.#removeModelFromRelationMap(
        model,
        relationKey,
        relation[relationKey],
      );
    }
  }

  #removeModelFromRelationMap<TKey extends keyof TRelation>(
    model: TModel,
    relationKey: TKey,
    relationValue: TRelation[TKey],
  ): void {
    const modelSet: TModel[] | undefined =
      this.#relationToModelsMaps[relationKey].get(relationValue);

    if (modelSet !== undefined) {
      const index: number = modelSet.indexOf(model);

      if (index !== NOT_FOUND_INDEX) {
        modelSet.splice(index, 1);
      }

      if (modelSet.length === 0) {
        this.#relationToModelsMaps[relationKey].delete(relationValue);
      }
    }
  }
}
