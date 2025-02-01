import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { ResolvedValueBinding } from '../../binding/models/ResolvedValueBinding';
import { ResolvedValueBindingNode } from '../../planning/models/ResolvedValueBindingNode';
import { ResolutionParams } from '../models/ResolutionParams';
import { resolveResolvedValueBindingNode } from './resolveResolvedValueBindingNode';

describe(resolveResolvedValueBindingNode.name, () => {
  let resolveResolvedValueBindingParamsMock: jest.Mock<
    (
      params: ResolutionParams,
      node: ResolvedValueBindingNode,
    ) => unknown[] | Promise<unknown[]>
  >;

  let paramsFixture: ResolutionParams;
  let nodeMock: jest.Mocked<ResolvedValueBindingNode>;

  beforeAll(() => {
    resolveResolvedValueBindingParamsMock = jest.fn();

    paramsFixture = Symbol() as unknown as ResolutionParams;
    nodeMock = {
      binding: {
        factory: jest.fn(),
      } as Partial<jest.Mocked<ResolvedValueBinding<unknown>>> as jest.Mocked<
        ResolvedValueBinding<unknown>
      >,
    } as Partial<
      jest.Mocked<ResolvedValueBindingNode>
    > as jest.Mocked<ResolvedValueBindingNode>;
  });

  describe('when called, and resolveResolvedValueBindingParams() returns an array', () => {
    let constructorResolvedValues: unknown[];
    let instanceResolvedValue: unknown;

    let result: unknown;

    beforeAll(() => {
      constructorResolvedValues = [Symbol()];
      instanceResolvedValue = Symbol();

      resolveResolvedValueBindingParamsMock.mockReturnValue(
        constructorResolvedValues,
      );

      nodeMock.binding.factory.mockReturnValueOnce(instanceResolvedValue);

      result = resolveResolvedValueBindingNode(
        resolveResolvedValueBindingParamsMock,
      )(paramsFixture, nodeMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call resolveResolvedValueBindingParams()', () => {
      expect(resolveResolvedValueBindingParamsMock).toHaveBeenCalledTimes(1);
      expect(resolveResolvedValueBindingParamsMock).toHaveBeenCalledWith(
        paramsFixture,
        nodeMock,
      );
    });

    it('should call node.binding.factory()', () => {
      expect(nodeMock.binding.factory).toHaveBeenCalledTimes(1);
      expect(nodeMock.binding.factory).toHaveBeenCalledWith(
        ...constructorResolvedValues,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(instanceResolvedValue);
    });
  });

  describe('when called, and resolveResolvedValueBindingParams() returns an array promise', () => {
    let constructorResolvedValues: unknown[];
    let instanceResolvedValue: unknown;

    let result: unknown;

    beforeAll(async () => {
      constructorResolvedValues = [Symbol()];
      instanceResolvedValue = Symbol();

      resolveResolvedValueBindingParamsMock.mockReturnValue(
        Promise.resolve(constructorResolvedValues),
      );

      nodeMock.binding.factory.mockResolvedValueOnce(instanceResolvedValue);

      result = await resolveResolvedValueBindingNode(
        resolveResolvedValueBindingParamsMock,
      )(paramsFixture, nodeMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call resolveResolvedValueBindingParams()', () => {
      expect(resolveResolvedValueBindingParamsMock).toHaveBeenCalledTimes(1);
      expect(resolveResolvedValueBindingParamsMock).toHaveBeenCalledWith(
        paramsFixture,
        nodeMock,
      );
    });

    it('should call node.binding.factory()', () => {
      expect(nodeMock.binding.factory).toHaveBeenCalledTimes(1);
      expect(nodeMock.binding.factory).toHaveBeenCalledWith(
        ...constructorResolvedValues,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(instanceResolvedValue);
    });
  });
});
