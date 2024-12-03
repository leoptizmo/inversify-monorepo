import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { bindingScopeValues } from '../../binding/models/BindingScope';
import { bindingTypeValues } from '../../binding/models/BindingType';
import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { ClassMetadata } from '../../metadata/models/ClassMetadata';
import { BindingNodeParent } from '../../planning/models/BindingNodeParent';
import { InstanceBindingNode } from '../../planning/models/InstanceBindingNode';
import { PlanServiceNode } from '../../planning/models/PlanServiceNode';
import { ResolutionParams } from '../models/ResolutionParams';
import { resolveInstanceBindingNodeFromConstructorParams } from './resolveInstanceBindingNodeFromConstructorParams';

describe(resolveInstanceBindingNodeFromConstructorParams.name, () => {
  let setInstancePropertiesMock: jest.Mock<
    (
      params: ResolutionParams,
      instance: Record<string | symbol, unknown>,
      node: InstanceBindingNode,
    ) => void | Promise<void>
  >;

  let constructorValuesFixture: unknown[];
  let paramsFixture: ResolutionParams;
  let nodeMock: jest.Mocked<InstanceBindingNode<InstanceBinding<unknown>>>;

  beforeAll(() => {
    setInstancePropertiesMock = jest.fn();

    constructorValuesFixture = [Symbol()];
    paramsFixture = Symbol() as unknown as ResolutionParams;
    nodeMock = {
      binding: {
        cache: {
          isRight: false,
          value: undefined,
        },
        id: 1,
        implementationType: jest.fn(),
        isSatisfiedBy: jest.fn(),
        moduleId: undefined,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: 'service-id',
        type: bindingTypeValues.Instance,
      },
      classMetadata: Symbol() as unknown as jest.Mocked<ClassMetadata>,
      constructorParams: [],
      parent: Symbol() as unknown as jest.Mocked<BindingNodeParent>,
      propertyParams: new Map() as jest.Mocked<
        Map<string | symbol, PlanServiceNode>
      >,
    };
  });

  describe('when called, and setInstanceProperties() returns undefined', () => {
    let expectedResultProperty: string | symbol;
    let expectedResultValue: unknown;

    let result: unknown;

    beforeAll(() => {
      expectedResultProperty = Symbol();
      expectedResultValue = 'value-fixture';

      nodeMock.binding.implementationType.mockImplementationOnce(function (
        this: Record<string | symbol, unknown>,
      ) {
        this[expectedResultProperty] = expectedResultValue;
      });

      setInstancePropertiesMock.mockReturnValueOnce(undefined);

      result = resolveInstanceBindingNodeFromConstructorParams(
        setInstancePropertiesMock,
      )(constructorValuesFixture, paramsFixture, nodeMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call new node.binding.implementationType()', () => {
      expect(nodeMock.binding.implementationType).toHaveBeenCalledTimes(1);
      expect(nodeMock.binding.implementationType).toHaveBeenCalledWith(
        ...constructorValuesFixture,
      );
    });

    it('should call setInstanceProperties()', () => {
      expect(setInstancePropertiesMock).toHaveBeenCalledTimes(1);
      expect(setInstancePropertiesMock).toHaveBeenCalledWith(
        paramsFixture,
        expect.any(Object),
        nodeMock,
      );
    });

    it('should return expected result', () => {
      const expectedResultProperties: Record<string | symbol, unknown> = {
        [expectedResultProperty]: expectedResultValue,
      };

      expect(result).toStrictEqual(
        expect.objectContaining(expectedResultProperties),
      );
    });
  });

  describe('when called, and setInstanceProperties() returns promise', () => {
    let expectedResultProperty: string | symbol;
    let expectedResultValue: unknown;

    let result: unknown;

    beforeAll(() => {
      expectedResultProperty = Symbol();
      expectedResultValue = 'value-fixture';

      nodeMock.binding.implementationType.mockImplementationOnce(function (
        this: Record<string | symbol, unknown>,
      ) {
        this[expectedResultProperty] = expectedResultValue;
      });

      setInstancePropertiesMock.mockReturnValueOnce(Promise.resolve(undefined));

      result = resolveInstanceBindingNodeFromConstructorParams(
        setInstancePropertiesMock,
      )(constructorValuesFixture, paramsFixture, nodeMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call new node.binding.implementationType()', () => {
      expect(nodeMock.binding.implementationType).toHaveBeenCalledTimes(1);
      expect(nodeMock.binding.implementationType).toHaveBeenCalledWith(
        ...constructorValuesFixture,
      );
    });

    it('should call setInstanceProperties()', () => {
      expect(setInstancePropertiesMock).toHaveBeenCalledTimes(1);
      expect(setInstancePropertiesMock).toHaveBeenCalledWith(
        paramsFixture,
        expect.any(Object),
        nodeMock,
      );
    });

    it('should return expected result', () => {
      const expectedResultProperties: Record<string | symbol, unknown> = {
        [expectedResultProperty]: expectedResultValue,
      };

      expect(result).toStrictEqual(
        Promise.resolve(expect.objectContaining(expectedResultProperties)),
      );
    });
  });
});
