export type OneToManyMapStartSpec<TRelation extends object> = {
  [TKey in keyof TRelation]: {
    isOptional: undefined extends TRelation[TKey] ? true : false;
  };
};

type RelationToModelMap<TModel, TRelation extends object> = {
  [TKey in keyof TRelation]-?: Map<TRelation[TKey], Set<TModel>>;
};

/**
 * Data structure able to efficiently manage a set of models related to a set of properties in a one to many relation.
 */
export class OneToManyMapStar<TModel, TRelation extends object> {
  readonly #modelToRelationMap: Map<TModel, TRelation>;
  readonly #relationToModelsMaps: RelationToModelMap<TModel, TRelation>;

  constructor(spec: OneToManyMapStartSpec<TRelation>) {
    this.#modelToRelationMap = new Map();

    this.#relationToModelsMaps = {} as RelationToModelMap<TModel, TRelation>;

    for (const specProperty of Reflect.ownKeys(spec) as (keyof TRelation)[]) {
      this.#relationToModelsMaps[specProperty] = new Map();
    }
  }

  public get<TKey extends keyof TRelation>(
    key: TKey,
    value: Required<TRelation>[TKey],
  ): Iterable<TModel> | undefined {
    return this.#relationToModelsMaps[key].get(value)?.values();
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
      const relation: TRelation | undefined =
        this.#modelToRelationMap.get(model);

      if (relation === undefined) {
        throw new Error('Expecting model relation, none found');
      }

      this.#removeModelFromRelationMaps(model, relation);
      this.#modelToRelationMap.delete(model);
    }
  }

  public set(model: TModel, relation: TRelation): void {
    this.#modelToRelationMap.set(model, relation);

    for (const relationKey of Reflect.ownKeys(
      relation,
    ) as (keyof TRelation)[]) {
      this.#buildOrGetRelationModelSet(relationKey, relation[relationKey]).add(
        model,
      );
    }
  }

  #buildOrGetRelationModelSet<TKey extends keyof TRelation>(
    relationKey: TKey,
    relationValue: TRelation[TKey],
  ): Set<TModel> {
    let modelSet: Set<TModel> | undefined =
      this.#relationToModelsMaps[relationKey].get(relationValue);

    if (modelSet === undefined) {
      modelSet = new Set();

      this.#relationToModelsMaps[relationKey].set(relationValue, modelSet);
    }

    return modelSet;
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
    const modelSet: Set<TModel> | undefined =
      this.#relationToModelsMaps[relationKey].get(relationValue);

    if (modelSet !== undefined) {
      modelSet.delete(model);

      if (modelSet.size === 0) {
        this.#relationToModelsMaps[relationKey].delete(relationValue);
      }
    }
  }
}
