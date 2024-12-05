import { jest } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMock: jest.Mock<any> = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeByRelationMock: jest.Mock<any> = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setMock: jest.Mock<any> = jest.fn();

export class OneToManyMapStar<TModel, TRelation extends object> {
  public readonly get: <TKey extends keyof TRelation>(
    key: TKey,
    value: Required<TRelation>[TKey],
  ) => Iterable<TModel> | undefined;

  public readonly removeByRelation: <TKey extends keyof TRelation>(
    key: TKey,
    value: Required<TRelation>[TKey],
  ) => void;

  public readonly set: (model: TModel, relation: TRelation) => void;

  constructor() {
    this.get = getMock;
    this.removeByRelation = removeByRelationMock;
    this.set = setMock;
  }
}
