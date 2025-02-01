import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/core');

jest.mock('../actions/getBindingId');
jest.mock('../calculations/isAnyAncestorBindingMetadata');
jest.mock('../calculations/isAnyAncestorBindingMetadataWithName');
jest.mock('../calculations/isAnyAncestorBindingMetadataWithServiceId');
jest.mock('../calculations/isAnyAncestorBindingMetadataWithTag');
jest.mock('../calculations/isBindingMetadataWithName');
jest.mock('../calculations/isBindingMetadataWithTag');
jest.mock('../calculations/isNoAncestorBindingMetadata');
jest.mock('../calculations/isNoAncestorBindingMetadataWithTag');
jest.mock('../calculations/isNoAncestorBindingMetadataWithServiceId');
jest.mock('../calculations/isNoAncestorBindingMetadataWithName');
jest.mock('../calculations/isNotParentBindingMetadata');
jest.mock('../calculations/isNotParentBindingMetadataWithName');
jest.mock('../calculations/isNotParentBindingMetadataWithServiceId');
jest.mock('../calculations/isNotParentBindingMetadataWithTag');
jest.mock('../calculations/isParentBindingMetadata');
jest.mock('../calculations/isParentBindingMetadataWithName');
jest.mock('../calculations/isParentBindingMetadataWithServiceId');
jest.mock('../calculations/isParentBindingMetadataWithTag');
jest.mock('../calculations/isResolvedValueMetadataInjectOptions');

import { ServiceIdentifier } from '@inversifyjs/common';
import {
  Binding,
  BindingActivation,
  BindingDeactivation,
  BindingMetadata,
  BindingScope,
  bindingScopeValues,
  BindingType,
  bindingTypeValues,
  ClassMetadata,
  ConstantValueBinding,
  DynamicValueBuilder,
  Factory,
  getClassMetadata,
  InstanceBinding,
  MetadataName,
  MetadataTag,
  Provider,
  ResolutionContext,
  ResolvedValueElementMetadataKind,
  ScopedBinding,
  ServiceRedirectionBinding,
} from '@inversifyjs/core';

import { Writable } from '../../common/models/Writable';
import { BindingConstraintUtils } from '../../container/binding/utils/BindingConstraintUtils';
import { ClassMetadataFixtures } from '../../metadata/fixtures/ClassMetadataFixtures';
import { getBindingId } from '../actions/getBindingId';
import { isAnyAncestorBindingMetadata } from '../calculations/isAnyAncestorBindingMetadata';
import { isAnyAncestorBindingMetadataWithName } from '../calculations/isAnyAncestorBindingMetadataWithName';
import { isAnyAncestorBindingMetadataWithServiceId } from '../calculations/isAnyAncestorBindingMetadataWithServiceId';
import { isAnyAncestorBindingMetadataWithTag } from '../calculations/isAnyAncestorBindingMetadataWithTag';
import { isBindingMetadataWithName } from '../calculations/isBindingMetadataWithName';
import { isBindingMetadataWithNoNameNorTags } from '../calculations/isBindingMetadataWithNoNameNorTags';
import { isBindingMetadataWithTag } from '../calculations/isBindingMetadataWithTag';
import { isNoAncestorBindingMetadata } from '../calculations/isNoAncestorBindingMetadata';
import { isNoAncestorBindingMetadataWithName } from '../calculations/isNoAncestorBindingMetadataWithName';
import { isNoAncestorBindingMetadataWithServiceId } from '../calculations/isNoAncestorBindingMetadataWithServiceId';
import { isNoAncestorBindingMetadataWithTag } from '../calculations/isNoAncestorBindingMetadataWithTag';
import { isNotParentBindingMetadata } from '../calculations/isNotParentBindingMetadata';
import { isNotParentBindingMetadataWithName } from '../calculations/isNotParentBindingMetadataWithName';
import { isNotParentBindingMetadataWithServiceId } from '../calculations/isNotParentBindingMetadataWithServiceId';
import { isNotParentBindingMetadataWithTag } from '../calculations/isNotParentBindingMetadataWithTag';
import { isParentBindingMetadata } from '../calculations/isParentBindingMetadata';
import { isParentBindingMetadataWithName } from '../calculations/isParentBindingMetadataWithName';
import { isParentBindingMetadataWithServiceId } from '../calculations/isParentBindingMetadataWithServiceId';
import { isParentBindingMetadataWithTag } from '../calculations/isParentBindingMetadataWithTag';
import { isResolvedValueMetadataInjectOptions } from '../calculations/isResolvedValueMetadataInjectOptions';
import {
  BindInFluentSyntaxImplementation,
  BindInWhenOnFluentSyntaxImplementation,
  BindOnFluentSyntaxImplementation,
  BindToFluentSyntaxImplementation,
  BindWhenFluentSyntaxImplementation,
  BindWhenOnFluentSyntaxImplementation,
} from './BindingFluentSyntaxImplementation';
import {
  ResolvedValueInjectOptions,
  ResolvedValueMetadataInjectOptions,
} from './ResolvedValueInjectOptions';

describe(BindInFluentSyntaxImplementation.name, () => {
  let bindingMock: jest.Mocked<
    ScopedBinding<BindingType, BindingScope, unknown>
  >;

  let bindingMockSetScopeMock: jest.Mock<(value: BindingScope) => void>;

  let bindInFluentSyntaxImplementation: BindInFluentSyntaxImplementation<unknown>;

  beforeAll(() => {
    let bindingScope: BindingScope = bindingScopeValues.Singleton;

    bindingMockSetScopeMock = jest.fn();

    bindingMock = {
      get scope(): BindingScope {
        return bindingScope;
      },
      set scope(value: BindingScope) {
        bindingMockSetScopeMock(value);

        bindingScope = value;
      },
    } as Partial<
      jest.Mocked<ScopedBinding<BindingType, BindingScope, unknown>>
    > as jest.Mocked<ScopedBinding<BindingType, BindingScope, unknown>>;

    bindInFluentSyntaxImplementation = new BindInFluentSyntaxImplementation(
      bindingMock,
    );
  });

  describe.each<
    [
      string,
      (
        bindInFluentSyntaxImplementation: BindInFluentSyntaxImplementation<unknown>,
      ) => unknown,
      BindingScope,
    ]
  >([
    [
      '.inRequestScope()',
      (
        bindInFluentSyntaxImplementation: BindInFluentSyntaxImplementation<unknown>,
      ) => bindInFluentSyntaxImplementation.inRequestScope(),
      bindingScopeValues.Request,
    ],
    [
      '.inSingletonScope()',
      (
        bindInFluentSyntaxImplementation: BindInFluentSyntaxImplementation<unknown>,
      ) => bindInFluentSyntaxImplementation.inSingletonScope(),
      bindingScopeValues.Singleton,
    ],
    [
      '.inTransientScope()',
      (
        bindInFluentSyntaxImplementation: BindInFluentSyntaxImplementation<unknown>,
      ) => bindInFluentSyntaxImplementation.inTransientScope(),
      bindingScopeValues.Transient,
    ],
  ])(
    '%s',
    (
      _: string,
      buildResult: (
        bindInFluentSyntaxImplementation: BindInFluentSyntaxImplementation<unknown>,
      ) => unknown,
      expectedScope: BindingScope,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = buildResult(bindInFluentSyntaxImplementation);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should set binding scope', () => {
          expect(bindingMockSetScopeMock).toHaveBeenCalledTimes(1);
          expect(bindingMockSetScopeMock).toHaveBeenCalledWith(expectedScope);
        });

        it('should return BindWhenOnFluentSyntax', () => {
          expect(result).toBeInstanceOf(BindWhenOnFluentSyntaxImplementation);
        });
      });
    },
  );
});

describe(BindToFluentSyntaxImplementation.name, () => {
  let bindingIdFixture: number;

  let dynamicValueBuilderfixture: DynamicValueBuilder<unknown>;
  let factoryBuilderFixture: (context: ResolutionContext) => Factory<unknown>;
  let providerBuilderFixture: (context: ResolutionContext) => Provider<unknown>;

  let callbackMock: jest.Mock<(binding: Binding) => void>;
  let containerModuleIdFixture: number;
  let defaultScopeFixture: BindingScope;
  let serviceIdentifierFixture: ServiceIdentifier;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<any>;

  beforeAll(() => {
    bindingIdFixture = 1;

    dynamicValueBuilderfixture = () => Symbol.for('dynamic-value');
    factoryBuilderFixture = () => () => Symbol.for('value-from-factory');
    providerBuilderFixture = () => async () =>
      Symbol.for('value-from-provider');

    (getBindingId as jest.Mock<typeof getBindingId>).mockReturnValue(
      bindingIdFixture,
    );

    callbackMock = jest.fn();
    containerModuleIdFixture = 1;
    defaultScopeFixture = bindingScopeValues.Singleton;
    serviceIdentifierFixture = 'service-id';

    bindToFluentSyntaxImplementation = new BindToFluentSyntaxImplementation(
      callbackMock,
      containerModuleIdFixture,
      defaultScopeFixture,
      serviceIdentifierFixture,
    );
  });

  describe.each<
    [
      string,
      (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<any>,
      ) => unknown,
      () => Binding,
      NewableFunction,
    ]
  >([
    [
      '.toConstantValue()',
      (
        bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<unknown>,
      ): unknown =>
        bindToFluentSyntaxImplementation.toConstantValue(
          Symbol.for('constant-value'),
        ),
      (): Binding => ({
        cache: {
          isRight: false,
          value: undefined,
        },
        id: bindingIdFixture,
        isSatisfiedBy: expect.any(Function) as unknown as (
          metadata: BindingMetadata,
        ) => boolean,
        moduleId: containerModuleIdFixture,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: serviceIdentifierFixture,
        type: bindingTypeValues.ConstantValue,
        value: Symbol.for('constant-value'),
      }),
      BindWhenOnFluentSyntaxImplementation,
    ],
    [
      '.toDynamicValue()',
      (
        bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<unknown>,
      ): unknown =>
        bindToFluentSyntaxImplementation.toDynamicValue(
          dynamicValueBuilderfixture,
        ),
      (): Binding => ({
        cache: {
          isRight: false,
          value: undefined,
        },
        id: bindingIdFixture,
        isSatisfiedBy: expect.any(Function) as unknown as (
          metadata: BindingMetadata,
        ) => boolean,
        moduleId: containerModuleIdFixture,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: defaultScopeFixture,
        serviceIdentifier: serviceIdentifierFixture,
        type: bindingTypeValues.DynamicValue,
        value: dynamicValueBuilderfixture,
      }),
      BindWhenOnFluentSyntaxImplementation,
    ],
    [
      '.toFactory()',
      (
        bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<
          Factory<unknown>
        >,
      ): unknown =>
        bindToFluentSyntaxImplementation.toFactory(factoryBuilderFixture),
      (): Binding => ({
        cache: {
          isRight: false,
          value: undefined,
        },
        factory: factoryBuilderFixture,
        id: bindingIdFixture,
        isSatisfiedBy: expect.any(Function) as unknown as (
          metadata: BindingMetadata,
        ) => boolean,
        moduleId: containerModuleIdFixture,
        onActivation: undefined,
        onDeactivation: undefined,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: serviceIdentifierFixture,
        type: bindingTypeValues.Factory,
      }),
      BindWhenOnFluentSyntaxImplementation,
    ],
    [
      '.toProvider()',
      (
        bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<
          Provider<unknown>
        >,
      ): unknown =>
        bindToFluentSyntaxImplementation.toProvider(providerBuilderFixture),
      (): Binding => ({
        cache: {
          isRight: false,
          value: undefined,
        },
        id: bindingIdFixture,
        isSatisfiedBy: expect.any(Function) as unknown as (
          metadata: BindingMetadata,
        ) => boolean,
        moduleId: containerModuleIdFixture,
        onActivation: undefined,
        onDeactivation: undefined,
        provider: providerBuilderFixture,
        scope: bindingScopeValues.Singleton,
        serviceIdentifier: serviceIdentifierFixture,
        type: bindingTypeValues.Provider,
      }),
      BindWhenOnFluentSyntaxImplementation,
    ],
  ])(
    '%s',
    (
      _: string,
      buildResult: (
        bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<unknown>,
      ) => unknown,
      buildExpectedBinding: () => Binding,
      expectedResultType: NewableFunction,
    ) => {
      describe('when called', () => {
        let expectedBinding: Binding;
        let result: unknown;

        beforeAll(() => {
          expectedBinding = buildExpectedBinding();
          result = buildResult(bindToFluentSyntaxImplementation);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call getBindingId', () => {
          expect(getBindingId).toHaveBeenCalledTimes(1);
          expect(getBindingId).toHaveBeenCalledWith();
        });

        it('should call callback', () => {
          expect(callbackMock).toHaveBeenCalledTimes(1);
          expect(callbackMock).toHaveBeenCalledWith(expectedBinding);
        });

        it('should return expected result', () => {
          expect(result).toBeInstanceOf(expectedResultType);
        });
      });
    },
  );

  describe('.toResolvedValue', () => {
    describe('having no inject options', () => {
      let factoryFixture: (arg: unknown) => unknown;

      beforeAll(() => {
        factoryFixture = (arg: unknown) => arg;
      });

      describe('when called', () => {
        let expectedBinding: Binding;
        let result: unknown;

        beforeAll(() => {
          expectedBinding = {
            cache: {
              isRight: false,
              value: undefined,
            },
            factory: factoryFixture,
            id: bindingIdFixture,
            isSatisfiedBy: BindingConstraintUtils.always,
            metadata: {
              arguments: [],
            },
            moduleId: containerModuleIdFixture,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: defaultScopeFixture,
            serviceIdentifier: serviceIdentifierFixture,
            type: bindingTypeValues.ResolvedValue,
          };

          result =
            bindToFluentSyntaxImplementation.toResolvedValue(factoryFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call getBindingId', () => {
          expect(getBindingId).toHaveBeenCalledTimes(1);
          expect(getBindingId).toHaveBeenCalledWith();
        });

        it('should call callback', () => {
          expect(callbackMock).toHaveBeenCalledTimes(1);
          expect(callbackMock).toHaveBeenCalledWith(expectedBinding);
        });

        it('should return expected result', () => {
          expect(result).toBeInstanceOf(BindInWhenOnFluentSyntaxImplementation);
        });
      });
    });

    describe('having service identifier inject options', () => {
      let factoryFixture: (arg: unknown) => unknown;
      let injectOptions: ResolvedValueInjectOptions<unknown>;

      beforeAll(() => {
        factoryFixture = (arg: unknown) => arg;
        injectOptions = 'service-id';
      });

      describe('when called', () => {
        let expectedBinding: Binding;
        let result: unknown;

        beforeAll(() => {
          expectedBinding = {
            cache: {
              isRight: false,
              value: undefined,
            },
            factory: factoryFixture,
            id: bindingIdFixture,
            isSatisfiedBy: BindingConstraintUtils.always,
            metadata: {
              arguments: [
                {
                  kind: expect.any(Number) as unknown as number,
                  name: undefined,
                  optional: false,
                  tags: new Map(),
                  value: 'service-id',
                },
              ],
            },
            moduleId: containerModuleIdFixture,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: defaultScopeFixture,
            serviceIdentifier: serviceIdentifierFixture,
            type: bindingTypeValues.ResolvedValue,
          };

          (
            isResolvedValueMetadataInjectOptions as unknown as jest.Mock<
              typeof isResolvedValueMetadataInjectOptions
            >
          ).mockReturnValueOnce(false);

          result = bindToFluentSyntaxImplementation.toResolvedValue(
            factoryFixture,
            [injectOptions],
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isResolvedValueMetadataInjectOptions()', () => {
          expect(isResolvedValueMetadataInjectOptions).toHaveBeenCalledTimes(1);
          expect(isResolvedValueMetadataInjectOptions).toHaveBeenCalledWith(
            injectOptions,
          );
        });

        it('should call getBindingId', () => {
          expect(getBindingId).toHaveBeenCalledTimes(1);
          expect(getBindingId).toHaveBeenCalledWith();
        });

        it('should call callback', () => {
          expect(callbackMock).toHaveBeenCalledTimes(1);
          expect(callbackMock).toHaveBeenCalledWith(expectedBinding);
        });

        it('should return expected result', () => {
          expect(result).toBeInstanceOf(BindInWhenOnFluentSyntaxImplementation);
        });
      });
    });

    describe('having inject options with service identifier and no optional metadata', () => {
      let factoryFixture: (arg: unknown) => unknown;
      let injectOptions: ResolvedValueInjectOptions<unknown>;

      beforeAll(() => {
        factoryFixture = (arg: unknown) => arg;
        injectOptions = { serviceIdentifier: 'service-id' };
      });

      describe('when called', () => {
        let expectedBinding: Binding;
        let result: unknown;

        beforeAll(() => {
          expectedBinding = {
            cache: {
              isRight: false,
              value: undefined,
            },
            factory: factoryFixture,
            id: bindingIdFixture,
            isSatisfiedBy: BindingConstraintUtils.always,
            metadata: {
              arguments: [
                {
                  kind: ResolvedValueElementMetadataKind.singleInjection,
                  name: undefined,
                  optional: false,
                  tags: new Map(),
                  value: 'service-id',
                },
              ],
            },
            moduleId: containerModuleIdFixture,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: defaultScopeFixture,
            serviceIdentifier: serviceIdentifierFixture,
            type: bindingTypeValues.ResolvedValue,
          };

          (
            isResolvedValueMetadataInjectOptions as unknown as jest.Mock<
              typeof isResolvedValueMetadataInjectOptions
            >
          ).mockReturnValueOnce(true);

          result = bindToFluentSyntaxImplementation.toResolvedValue(
            factoryFixture,
            [injectOptions],
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isResolvedValueMetadataInjectOptions()', () => {
          expect(isResolvedValueMetadataInjectOptions).toHaveBeenCalledTimes(1);
          expect(isResolvedValueMetadataInjectOptions).toHaveBeenCalledWith(
            injectOptions,
          );
        });

        it('should call getBindingId', () => {
          expect(getBindingId).toHaveBeenCalledTimes(1);
          expect(getBindingId).toHaveBeenCalledWith();
        });

        it('should call callback', () => {
          expect(callbackMock).toHaveBeenCalledTimes(1);
          expect(callbackMock).toHaveBeenCalledWith(expectedBinding);
        });

        it('should return expected result', () => {
          expect(result).toBeInstanceOf(BindInWhenOnFluentSyntaxImplementation);
        });
      });
    });

    describe('having inject options with service identifier and optional metadata', () => {
      let factoryFixture: (arg: unknown) => unknown;
      let injectOptions: ResolvedValueMetadataInjectOptions<unknown>;

      beforeAll(() => {
        factoryFixture = (arg: unknown) => arg;
        injectOptions = {
          isMultiple: true,
          name: 'name',
          optional: true,
          serviceIdentifier: 'service-id',
          tags: [
            {
              key: 'tag',
              value: 'tagValue',
            },
          ],
        };
      });

      describe('when called', () => {
        let expectedBinding: Binding;
        let result: unknown;

        beforeAll(() => {
          expectedBinding = {
            cache: {
              isRight: false,
              value: undefined,
            },
            factory: factoryFixture,
            id: bindingIdFixture,
            isSatisfiedBy: BindingConstraintUtils.always,
            metadata: {
              arguments: [
                {
                  kind: ResolvedValueElementMetadataKind.multipleInjection,
                  name: 'name',
                  optional: true,
                  tags: new Map<MetadataTag, unknown>([['tag', 'tagValue']]),
                  value: 'service-id',
                },
              ],
            },
            moduleId: containerModuleIdFixture,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: defaultScopeFixture,
            serviceIdentifier: serviceIdentifierFixture,
            type: bindingTypeValues.ResolvedValue,
          };

          (
            isResolvedValueMetadataInjectOptions as unknown as jest.Mock<
              typeof isResolvedValueMetadataInjectOptions
            >
          ).mockReturnValueOnce(true);

          result = bindToFluentSyntaxImplementation.toResolvedValue(
            factoryFixture,
            [injectOptions],
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call isResolvedValueMetadataInjectOptions()', () => {
          expect(isResolvedValueMetadataInjectOptions).toHaveBeenCalledTimes(1);
          expect(isResolvedValueMetadataInjectOptions).toHaveBeenCalledWith(
            injectOptions,
          );
        });

        it('should call getBindingId', () => {
          expect(getBindingId).toHaveBeenCalledTimes(1);
          expect(getBindingId).toHaveBeenCalledWith();
        });

        it('should call callback', () => {
          expect(callbackMock).toHaveBeenCalledTimes(1);
          expect(callbackMock).toHaveBeenCalledWith(expectedBinding);
        });

        it('should return expected result', () => {
          expect(result).toBeInstanceOf(BindInWhenOnFluentSyntaxImplementation);
        });
      });
    });
  });

  describe('.toSelf', () => {
    describe('having a non function service identifier', () => {
      let callbackMock: jest.Mock<(binding: Binding) => void>;
      let containerModuleIdFixture: number;
      let defaultScopeFixture: BindingScope;
      let serviceIdentifierFixture: ServiceIdentifier;

      let bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<unknown>;

      beforeAll(() => {
        callbackMock = jest.fn();
        containerModuleIdFixture = 1;
        defaultScopeFixture = bindingScopeValues.Singleton;
        serviceIdentifierFixture = 'service-id';

        bindToFluentSyntaxImplementation = new BindToFluentSyntaxImplementation(
          callbackMock,
          containerModuleIdFixture,
          defaultScopeFixture,
          serviceIdentifierFixture,
        );
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            bindToFluentSyntaxImplementation.toSelf();
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should trow an Error', () => {
          const expectedErrorProperties: Partial<Error> = {
            message:
              '"toSelf" function can only be applied when a newable function is used as service identifier',
          };

          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining(expectedErrorProperties),
          );
        });
      });
    });

    describe('having a function service identifier', () => {
      class Foo {}

      let callbackMock: jest.Mock<(binding: Binding) => void>;
      let containerModuleIdFixture: number;
      let defaultScopeFixture: BindingScope;
      let serviceIdentifierFixture: ServiceIdentifier;

      let bindToFluentSyntaxImplementation: BindToFluentSyntaxImplementation<unknown>;

      beforeAll(() => {
        callbackMock = jest.fn();
        containerModuleIdFixture = 1;
        defaultScopeFixture = bindingScopeValues.Singleton;
        serviceIdentifierFixture = Foo;

        bindToFluentSyntaxImplementation = new BindToFluentSyntaxImplementation(
          callbackMock,
          containerModuleIdFixture,
          defaultScopeFixture,
          serviceIdentifierFixture,
        );
      });

      describe('when called, and getClassMetadata() returns ClassMetadata with undefined scope', () => {
        let result: unknown;

        beforeAll(() => {
          (
            getClassMetadata as jest.Mock<typeof getClassMetadata>
          ).mockReturnValueOnce(ClassMetadataFixtures.withScopeUndefined);

          result = bindToFluentSyntaxImplementation.toSelf();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call getClassMetadata()', () => {
          expect(getClassMetadata).toHaveBeenCalledTimes(1);
          expect(getClassMetadata).toHaveBeenCalledWith(
            serviceIdentifierFixture,
          );
        });

        it('should call callback()', () => {
          const expectedBinding: InstanceBinding<unknown> = {
            cache: {
              isRight: false,
              value: undefined,
            },
            id: getBindingId(),
            implementationType: Foo,
            isSatisfiedBy: expect.any(Function) as unknown as (
              metadata: BindingMetadata,
            ) => boolean,
            moduleId: containerModuleIdFixture,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: defaultScopeFixture,
            serviceIdentifier: serviceIdentifierFixture,
            type: bindingTypeValues.Instance,
          };

          expect(callbackMock).toHaveBeenCalledTimes(1);
          expect(callbackMock).toHaveBeenCalledWith(expectedBinding);
        });

        it('should return expected result', () => {
          expect(result).toBeInstanceOf(BindInWhenOnFluentSyntaxImplementation);
        });
      });

      describe('when called, and getClassMetadata() returns ClassMetadata with scope', () => {
        let classMetadataFixture: ClassMetadata;

        let result: unknown;

        beforeAll(() => {
          classMetadataFixture = ClassMetadataFixtures.withScopeRequest;

          (
            getClassMetadata as jest.Mock<typeof getClassMetadata>
          ).mockReturnValueOnce(classMetadataFixture);

          result = bindToFluentSyntaxImplementation.toSelf();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call getClassMetadata()', () => {
          expect(getClassMetadata).toHaveBeenCalledTimes(1);
          expect(getClassMetadata).toHaveBeenCalledWith(
            serviceIdentifierFixture,
          );
        });

        it('should call callback()', () => {
          const expectedBinding: InstanceBinding<unknown> = {
            cache: {
              isRight: false,
              value: undefined,
            },
            id: getBindingId(),
            implementationType: Foo,
            isSatisfiedBy: expect.any(Function) as unknown as (
              metadata: BindingMetadata,
            ) => boolean,
            moduleId: containerModuleIdFixture,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: classMetadataFixture.scope as BindingScope,
            serviceIdentifier: serviceIdentifierFixture,
            type: bindingTypeValues.Instance,
          };

          expect(callbackMock).toHaveBeenCalledTimes(1);
          expect(callbackMock).toHaveBeenCalledWith(expectedBinding);
        });

        it('should return expected result', () => {
          expect(result).toBeInstanceOf(BindInWhenOnFluentSyntaxImplementation);
        });
      });
    });
  });

  describe('.toService', () => {
    describe('when called', () => {
      let targetServiceFixture: ServiceIdentifier;

      let result: unknown;

      beforeAll(() => {
        targetServiceFixture = 'another-service-id';

        result =
          bindToFluentSyntaxImplementation.toService(targetServiceFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call callback()', () => {
        const expectedBinding: ServiceRedirectionBinding<unknown> = {
          id: bindingIdFixture,
          isSatisfiedBy: expect.any(Function) as unknown as (
            metadata: BindingMetadata,
          ) => boolean,
          moduleId: containerModuleIdFixture,
          serviceIdentifier: serviceIdentifierFixture,
          targetServiceIdentifier: targetServiceFixture,
          type: bindingTypeValues.ServiceRedirection,
        };

        expect(callbackMock).toHaveBeenCalledTimes(1);
        expect(callbackMock).toHaveBeenCalledWith(expectedBinding);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});

describe(BindOnFluentSyntaxImplementation.name, () => {
  let bindingFixture: Writable<ConstantValueBinding<unknown>>;
  let bindingActivationSetterMock: jest.Mock<
    (value: BindingActivation | undefined) => undefined
  >;
  let bindingDeactivationSetterMock: jest.Mock<
    (value: BindingDeactivation | undefined) => undefined
  >;

  let bindOnFluentSyntaxImplementation: BindOnFluentSyntaxImplementation<unknown>;

  beforeAll(() => {
    bindingActivationSetterMock = jest.fn();
    bindingDeactivationSetterMock = jest.fn();

    bindingFixture = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 1,
      isSatisfiedBy: expect.any(Function) as unknown as (
        metadata: BindingMetadata,
      ) => boolean,
      moduleId: undefined,
      get onActivation(): BindingActivation<unknown> | undefined {
        return undefined;
      },
      set onActivation(value: BindingActivation<unknown> | undefined) {
        bindingActivationSetterMock(value);
      },
      get onDeactivation(): BindingDeactivation<unknown> | undefined {
        return undefined;
      },
      set onDeactivation(value: BindingDeactivation<unknown> | undefined) {
        bindingDeactivationSetterMock(value);
      },
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: 'service-id',
      type: bindingTypeValues.ConstantValue,
      value: Symbol.for('constant-value'),
    };

    bindOnFluentSyntaxImplementation = new BindOnFluentSyntaxImplementation(
      bindingFixture,
    );
  });

  describe('.onActivation', () => {
    describe('when called', () => {
      let activationFixture: BindingActivation<unknown>;

      let result: unknown;

      beforeAll(() => {
        activationFixture = (value: unknown) => value;

        result =
          bindOnFluentSyntaxImplementation.onActivation(activationFixture);
      });

      it('should set binding activation', () => {
        expect(bindingActivationSetterMock).toHaveBeenCalledTimes(1);
        expect(bindingActivationSetterMock).toHaveBeenCalledWith(
          activationFixture,
        );
      });

      it('should return expected result', () => {
        expect(result).toBeInstanceOf(BindWhenFluentSyntaxImplementation);
      });
    });
  });

  describe('.onDeactivation', () => {
    describe('when called', () => {
      let deactivationFixture: BindingDeactivation<unknown>;

      let result: unknown;

      beforeAll(() => {
        deactivationFixture = () => undefined;

        result =
          bindOnFluentSyntaxImplementation.onDeactivation(deactivationFixture);
      });

      it('should set binding deactivation', () => {
        expect(bindingDeactivationSetterMock).toHaveBeenCalledTimes(1);
        expect(bindingDeactivationSetterMock).toHaveBeenCalledWith(
          deactivationFixture,
        );
      });

      it('should return expected result', () => {
        expect(result).toBeInstanceOf(BindWhenFluentSyntaxImplementation);
      });
    });
  });
});

describe(BindWhenFluentSyntaxImplementation.name, () => {
  let bindingFixture: ConstantValueBinding<unknown>;

  let isSatisfiedBySetterMock: jest.Mock<
    (value: (metadata: BindingMetadata) => boolean) => void
  >;

  let bindWhenFluentSyntaxImplementation: BindWhenFluentSyntaxImplementation<unknown>;

  beforeAll(() => {
    isSatisfiedBySetterMock = jest.fn();

    bindingFixture = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 1,
      get isSatisfiedBy() {
        return () => true;
      },
      set isSatisfiedBy(value: (metadata: BindingMetadata) => boolean) {
        isSatisfiedBySetterMock(value);
      },
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: 'service-id',
      type: bindingTypeValues.ConstantValue,
      value: Symbol(),
    };

    bindWhenFluentSyntaxImplementation = new BindWhenFluentSyntaxImplementation(
      bindingFixture,
    );
  });

  describe('.when', () => {
    let constraintFixture: (metadata: BindingMetadata) => boolean;

    let result: unknown;

    beforeAll(() => {
      constraintFixture = () => true;

      result = bindWhenFluentSyntaxImplementation.when(constraintFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should set constraint', () => {
      expect(isSatisfiedBySetterMock).toHaveBeenCalledTimes(1);
      expect(isSatisfiedBySetterMock).toHaveBeenCalledWith(constraintFixture);
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenAnyAncestor', () => {
    let constraintFixture: (metadata: BindingMetadata) => boolean;

    let result: unknown;

    beforeAll(() => {
      constraintFixture = () => true;

      result =
        bindWhenFluentSyntaxImplementation.whenAnyAncestor(constraintFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isAnyAncestorBindingMetadata', () => {
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledWith(
        constraintFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenAnyAncestorIs', () => {
    let serviceIdFixture: ServiceIdentifier;

    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = 'name-fixture';

      result =
        bindWhenFluentSyntaxImplementation.whenAnyAncestorIs(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isAnyAncestorBindingMetadataWithServiceId', () => {
      expect(isAnyAncestorBindingMetadataWithServiceId).toHaveBeenCalledTimes(
        1,
      );
      expect(isAnyAncestorBindingMetadataWithServiceId).toHaveBeenCalledWith(
        serviceIdFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenAnyAncestorNamed', () => {
    let nameFixture: MetadataName;

    let result: unknown;

    beforeAll(() => {
      nameFixture = 'name-fixture';

      result =
        bindWhenFluentSyntaxImplementation.whenAnyAncestorNamed(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isAnyAncestorBindingMetadataWithName', () => {
      expect(isAnyAncestorBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isAnyAncestorBindingMetadataWithName).toHaveBeenCalledWith(
        nameFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenAnyAncestorTagged', () => {
    let tagFixture: MetadataTag;
    let tagValueFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      tagFixture = 'tag-fixture';
      tagValueFixture = Symbol();

      result = bindWhenFluentSyntaxImplementation.whenAnyAncestorTagged(
        tagFixture,
        tagValueFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isAnyAncestorBindingMetadataWithTag', () => {
      expect(isAnyAncestorBindingMetadataWithTag).toHaveBeenCalledTimes(1);
      expect(isAnyAncestorBindingMetadataWithTag).toHaveBeenCalledWith(
        tagFixture,
        tagValueFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenDefault', () => {
    let result: unknown;

    beforeAll(() => {
      result = bindWhenFluentSyntaxImplementation.whenDefault();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should set constraint', () => {
      expect(isSatisfiedBySetterMock).toHaveBeenCalledTimes(1);
      expect(isSatisfiedBySetterMock).toHaveBeenCalledWith(
        isBindingMetadataWithNoNameNorTags,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNamed', () => {
    let nameFixture: MetadataName;

    let result: unknown;

    beforeAll(() => {
      nameFixture = 'name-fixture';

      result = bindWhenFluentSyntaxImplementation.whenNamed(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithName', () => {
      expect(isBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithName).toHaveBeenCalledWith(nameFixture);
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenParent', () => {
    let constraintFixture: (metadata: BindingMetadata) => boolean;

    let result: unknown;

    beforeAll(() => {
      constraintFixture = () => true;

      result = bindWhenFluentSyntaxImplementation.whenParent(constraintFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isParentBindingMetadata', () => {
      expect(isParentBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isParentBindingMetadata).toHaveBeenCalledWith(constraintFixture);
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenParentIs', () => {
    let serviceIdFixture: ServiceIdentifier;

    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = 'name-fixture';

      result =
        bindWhenFluentSyntaxImplementation.whenParentIs(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isParentBindingMetadataWithServiceId', () => {
      expect(isParentBindingMetadataWithServiceId).toHaveBeenCalledTimes(1);
      expect(isParentBindingMetadataWithServiceId).toHaveBeenCalledWith(
        serviceIdFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenParentNamed', () => {
    let nameFixture: MetadataName;

    let result: unknown;

    beforeAll(() => {
      nameFixture = 'name-fixture';

      result = bindWhenFluentSyntaxImplementation.whenParentNamed(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isParentBindingMetadataWithName', () => {
      expect(isParentBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isParentBindingMetadataWithName).toHaveBeenCalledWith(nameFixture);
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenParentTagged', () => {
    let tagFixture: MetadataTag;
    let tagValueFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      tagFixture = 'tag-fixture';
      tagValueFixture = Symbol();

      result = bindWhenFluentSyntaxImplementation.whenParentTagged(
        tagFixture,
        tagValueFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isParentBindingMetadataWithTag', () => {
      expect(isParentBindingMetadataWithTag).toHaveBeenCalledTimes(1);
      expect(isParentBindingMetadataWithTag).toHaveBeenCalledWith(
        tagFixture,
        tagValueFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenTagged', () => {
    let tagFixture: MetadataTag;
    let tagValueFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      tagFixture = 'tag-fixture';
      tagValueFixture = Symbol();

      result = bindWhenFluentSyntaxImplementation.whenTagged(
        tagFixture,
        tagValueFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithTag', () => {
      expect(isBindingMetadataWithTag).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithTag).toHaveBeenCalledWith(
        tagFixture,
        tagValueFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNoParentIs', () => {
    let serviceIdFixture: ServiceIdentifier;

    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = 'name-fixture';

      result =
        bindWhenFluentSyntaxImplementation.whenNoParentIs(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isNotParentBindingMetadataWithServiceId', () => {
      expect(isNotParentBindingMetadataWithServiceId).toHaveBeenCalledTimes(1);
      expect(isNotParentBindingMetadataWithServiceId).toHaveBeenCalledWith(
        serviceIdFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNoParentNamed', () => {
    let nameFixture: MetadataName;

    let result: unknown;

    beforeAll(() => {
      nameFixture = 'name-fixture';

      result =
        bindWhenFluentSyntaxImplementation.whenNoParentNamed(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isNotParentBindingMetadataWithName', () => {
      expect(isNotParentBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isNotParentBindingMetadataWithName).toHaveBeenCalledWith(
        nameFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNoParentTagged', () => {
    let tagFixture: MetadataTag;
    let tagValueFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      tagFixture = 'tag-fixture';
      tagValueFixture = Symbol();

      result = bindWhenFluentSyntaxImplementation.whenNoParentTagged(
        tagFixture,
        tagValueFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isNotParentBindingMetadataWithTag', () => {
      expect(isNotParentBindingMetadataWithTag).toHaveBeenCalledTimes(1);
      expect(isNotParentBindingMetadataWithTag).toHaveBeenCalledWith(
        tagFixture,
        tagValueFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNoParent', () => {
    let constraintFixture: (metadata: BindingMetadata) => boolean;

    let result: unknown;

    beforeAll(() => {
      constraintFixture = () => true;

      result =
        bindWhenFluentSyntaxImplementation.whenNoParent(constraintFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isNotParentBindingMetadata', () => {
      expect(isNotParentBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isNotParentBindingMetadata).toHaveBeenCalledWith(
        constraintFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNoAncestor', () => {
    let constraintFixture: (metadata: BindingMetadata) => boolean;

    let result: unknown;

    beforeAll(() => {
      constraintFixture = () => true;

      result =
        bindWhenFluentSyntaxImplementation.whenNoAncestor(constraintFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isNoAncestorBindingMetadata', () => {
      expect(isNoAncestorBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isNoAncestorBindingMetadata).toHaveBeenCalledWith(
        constraintFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNoAncestorIs', () => {
    let serviceIdFixture: ServiceIdentifier;

    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = 'service-id-fixture';

      result =
        bindWhenFluentSyntaxImplementation.whenNoAncestorIs(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isNoAncestorBindingMetadataWithServiceId', () => {
      expect(isNoAncestorBindingMetadataWithServiceId).toHaveBeenCalledTimes(1);
      expect(isNoAncestorBindingMetadataWithServiceId).toHaveBeenCalledWith(
        serviceIdFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNoAncestorNamed', () => {
    let nameFixture: MetadataName;

    let result: unknown;

    beforeAll(() => {
      nameFixture = 'name-fixture';

      result =
        bindWhenFluentSyntaxImplementation.whenNoAncestorNamed(nameFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isNoAncestorBindingMetadataWithName', () => {
      expect(isNoAncestorBindingMetadataWithName).toHaveBeenCalledTimes(1);
      expect(isNoAncestorBindingMetadataWithName).toHaveBeenCalledWith(
        nameFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });

  describe('.whenNoAncestorTagged', () => {
    let tagFixture: MetadataTag;
    let tagValueFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      tagFixture = 'tag-fixture';
      tagValueFixture = Symbol();

      result = bindWhenFluentSyntaxImplementation.whenNoAncestorTagged(
        tagFixture,
        tagValueFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isNoAncestorBindingMetadataWithTag', () => {
      expect(isNoAncestorBindingMetadataWithTag).toHaveBeenCalledTimes(1);
      expect(isNoAncestorBindingMetadataWithTag).toHaveBeenCalledWith(
        tagFixture,
        tagValueFixture,
      );
    });

    it('should return expected result', () => {
      expect(result).toBeInstanceOf(BindOnFluentSyntaxImplementation);
    });
  });
});

describe(BindWhenOnFluentSyntaxImplementation.name, () => {
  let bindingFixture: Writable<ConstantValueBinding<unknown>>;
  let bindingActivationSetterMock: jest.Mock<
    (value: BindingActivation | undefined) => undefined
  >;
  let bindingDeactivationSetterMock: jest.Mock<
    (value: BindingDeactivation | undefined) => undefined
  >;

  let bindWhenOnFluentSyntaxImplementation: BindWhenOnFluentSyntaxImplementation<unknown>;

  beforeAll(() => {
    bindingActivationSetterMock = jest.fn();
    bindingDeactivationSetterMock = jest.fn();

    bindingFixture = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 1,
      isSatisfiedBy: expect.any(Function) as unknown as (
        metadata: BindingMetadata,
      ) => boolean,
      moduleId: undefined,
      get onActivation(): BindingActivation<unknown> | undefined {
        return undefined;
      },
      set onActivation(value: BindingActivation<unknown> | undefined) {
        bindingActivationSetterMock(value);
      },
      get onDeactivation(): BindingDeactivation<unknown> | undefined {
        return undefined;
      },
      set onDeactivation(value: BindingDeactivation<unknown> | undefined) {
        bindingDeactivationSetterMock(value);
      },
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: 'service-id',
      type: bindingTypeValues.ConstantValue,
      value: Symbol.for('constant-value'),
    };

    bindWhenOnFluentSyntaxImplementation =
      new BindWhenOnFluentSyntaxImplementation(bindingFixture);
  });

  describe('.onActivation', () => {
    describe('when called', () => {
      let activationFixture: BindingActivation<unknown>;

      let result: unknown;

      beforeAll(() => {
        activationFixture = (value: unknown) => value;

        result =
          bindWhenOnFluentSyntaxImplementation.onActivation(activationFixture);
      });

      it('should set binding activation', () => {
        expect(bindingActivationSetterMock).toHaveBeenCalledTimes(1);
        expect(bindingActivationSetterMock).toHaveBeenCalledWith(
          activationFixture,
        );
      });

      it('should return expected result', () => {
        expect(result).toBeInstanceOf(BindWhenFluentSyntaxImplementation);
      });
    });
  });

  describe('.onDeactivation', () => {
    describe('when called', () => {
      let deactivationFixture: BindingDeactivation<unknown>;

      let result: unknown;

      beforeAll(() => {
        deactivationFixture = () => undefined;

        result =
          bindWhenOnFluentSyntaxImplementation.onDeactivation(
            deactivationFixture,
          );
      });

      it('should set binding deactivation', () => {
        expect(bindingDeactivationSetterMock).toHaveBeenCalledTimes(1);
        expect(bindingDeactivationSetterMock).toHaveBeenCalledWith(
          deactivationFixture,
        );
      });

      it('should return expected result', () => {
        expect(result).toBeInstanceOf(BindWhenFluentSyntaxImplementation);
      });
    });
  });
});

describe(BindInWhenOnFluentSyntaxImplementation.name, () => {
  let bindingMock: jest.Mocked<
    ScopedBinding<BindingType, BindingScope, unknown>
  >;

  let bindingMockSetScopeMock: jest.Mock<(value: BindingScope) => void>;

  let bindInWhenOnFluentSyntaxImplementation: BindInWhenOnFluentSyntaxImplementation<unknown>;

  beforeAll(() => {
    let bindingScope: BindingScope = bindingScopeValues.Singleton;

    bindingMockSetScopeMock = jest.fn();

    bindingMock = {
      get scope(): BindingScope {
        return bindingScope;
      },
      set scope(value: BindingScope) {
        bindingMockSetScopeMock(value);

        bindingScope = value;
      },
    } as Partial<
      jest.Mocked<ScopedBinding<BindingType, BindingScope, unknown>>
    > as jest.Mocked<ScopedBinding<BindingType, BindingScope, unknown>>;

    bindInWhenOnFluentSyntaxImplementation =
      new BindInWhenOnFluentSyntaxImplementation(bindingMock);
  });

  describe.each<
    [
      string,
      (
        bindInFluentSyntaxImplementation: BindInWhenOnFluentSyntaxImplementation<unknown>,
      ) => unknown,
      BindingScope,
    ]
  >([
    [
      '.inRequestScope()',
      (
        bindInFluentSyntaxImplementation: BindInWhenOnFluentSyntaxImplementation<unknown>,
      ) => bindInFluentSyntaxImplementation.inRequestScope(),
      bindingScopeValues.Request,
    ],
    [
      '.inSingletonScope()',
      (
        bindInFluentSyntaxImplementation: BindInWhenOnFluentSyntaxImplementation<unknown>,
      ) => bindInFluentSyntaxImplementation.inSingletonScope(),
      bindingScopeValues.Singleton,
    ],
    [
      '.inTransientScope()',
      (
        bindInFluentSyntaxImplementation: BindInWhenOnFluentSyntaxImplementation<unknown>,
      ) => bindInFluentSyntaxImplementation.inTransientScope(),
      bindingScopeValues.Transient,
    ],
  ])(
    '%s',
    (
      _: string,
      buildResult: (
        bindInFluentSyntaxImplementation: BindInWhenOnFluentSyntaxImplementation<unknown>,
      ) => unknown,
      expectedScope: BindingScope,
    ) => {
      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = buildResult(bindInWhenOnFluentSyntaxImplementation);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should set binding scope', () => {
          expect(bindingMockSetScopeMock).toHaveBeenCalledTimes(1);
          expect(bindingMockSetScopeMock).toHaveBeenCalledWith(expectedScope);
        });

        it('should return BindWhenOnFluentSyntax', () => {
          expect(result).toBeInstanceOf(BindWhenOnFluentSyntaxImplementation);
        });
      });
    },
  );
});
