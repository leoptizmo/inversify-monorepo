import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/common');

import { stringifyServiceIdentifier } from '@inversifyjs/common';

jest.mock('../../binding/calculations/stringifyBinding');
jest.mock('./isPlanServiceRedirectionBindingNode');

import { stringifyBinding } from '../../binding/calculations/stringifyBinding';
import { bindingScopeValues } from '../../binding/models/BindingScope';
import { bindingTypeValues } from '../../binding/models/BindingType';
import { InversifyCoreError } from '../../error/models/InversifyCoreError';
import { InversifyCoreErrorKind } from '../../error/models/InversifyCoreErrorKind';
import { PlanBindingNode } from '../models/PlanBindingNode';
import { PlanServiceNode } from '../models/PlanServiceNode';
import { PlanServiceRedirectionBindingNode } from '../models/PlanServiceRedirectionBindingNode';
import { isPlanServiceRedirectionBindingNode } from './isPlanServiceRedirectionBindingNode';
import { throwErrorWhenUnexpectedBindingsAmountFound } from './throwErrorWhenUnexpectedBindingsAmountFound';

describe(throwErrorWhenUnexpectedBindingsAmountFound.name, () => {
  describe('having undefined bindings and isOptional false and node PlanServiceNode', () => {
    let bindingsFixture: undefined;
    let isOptionalFixture: false;
    let nodeFixture: PlanServiceNode;

    beforeAll(() => {
      bindingsFixture = undefined;
      isOptionalFixture = false;
      nodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: 'service-identifier',
      };
    });

    describe('when called, and isPlanServiceRedirectionBindingNode() returns true', () => {
      let stringifiedServiceIdentifier: string;

      let result: unknown;

      beforeAll(() => {
        stringifiedServiceIdentifier = 'stringified-service-id';

        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        (
          stringifyServiceIdentifier as jest.Mock<
            typeof stringifyServiceIdentifier
          >
        )
          .mockReturnValueOnce(stringifiedServiceIdentifier)
          .mockReturnValueOnce(stringifiedServiceIdentifier);

        try {
          throwErrorWhenUnexpectedBindingsAmountFound(
            bindingsFixture,
            isOptionalFixture,
            nodeFixture,
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw InversifyCoreError', () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.planning,
          message: `No bindings found for service: "${stringifiedServiceIdentifier}".

Trying to resolve bindings for "${stringifiedServiceIdentifier} (Root service)".`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('having single binding and isOptional false and node PlanServiceNode', () => {
    let bindingsFixture: PlanBindingNode;
    let isOptionalFixture: false;
    let nodeFixture: PlanServiceNode;

    beforeAll(() => {
      const parentNode: PlanServiceNode = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: 'target-service-id',
      };

      bindingsFixture = {
        binding: {
          cache: {
            isRight: true,
            value: Symbol(),
          },
          id: 0,
          isSatisfiedBy: () => true,
          moduleId: undefined,
          onActivation: undefined,
          onDeactivation: undefined,
          scope: bindingScopeValues.Singleton,
          serviceIdentifier: 'target-service-id',
          type: bindingTypeValues.ConstantValue,
          value: Symbol(),
        },
        parent: parentNode,
      };
      isOptionalFixture = false;
      nodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: 'service-identifier',
      };
    });

    describe('when called, and isPlanServiceRedirectionBindingNode() returns false', () => {
      let result: unknown;

      beforeAll(() => {
        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        result = throwErrorWhenUnexpectedBindingsAmountFound(
          bindingsFixture,
          isOptionalFixture,
          nodeFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having bindings empty array and isOptional false and node PlanServiceRedirectionBindingNode', () => {
    let bindingsFixture: [];
    let isOptionalFixture: false;
    let nodeFixture: PlanServiceRedirectionBindingNode;

    beforeAll(() => {
      bindingsFixture = [];
      isOptionalFixture = false;
      nodeFixture = {
        binding: {
          id: 1,
          isSatisfiedBy: () => true,
          moduleId: undefined,
          serviceIdentifier: 'service-id',
          targetServiceIdentifier: 'target-service-id',
          type: bindingTypeValues.ServiceRedirection,
        },
        parent: {
          bindings: [],
          parent: undefined,
          serviceIdentifier: 'service-id',
        },
        redirections: [],
      };
    });

    describe('when called, and isPlanServiceRedirectionBindingNode() returns true', () => {
      let stringifiedServiceIdentifier: string;
      let stringifiedTargetServiceIdentifier: string;

      let result: unknown;

      beforeAll(() => {
        stringifiedServiceIdentifier = 'stringified-service-id';
        stringifiedTargetServiceIdentifier = 'stringified-target-service-id';

        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(true);

        (
          stringifyServiceIdentifier as jest.Mock<
            typeof stringifyServiceIdentifier
          >
        )
          .mockReturnValueOnce(stringifiedTargetServiceIdentifier)
          .mockReturnValueOnce(stringifiedServiceIdentifier);

        try {
          result = throwErrorWhenUnexpectedBindingsAmountFound(
            bindingsFixture,
            isOptionalFixture,
            nodeFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw InversifyCoreError', () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.planning,
          message: `No bindings found for service: "${stringifiedTargetServiceIdentifier}".

Trying to resolve bindings for "${stringifiedServiceIdentifier}".`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('having bindings empty array and isOptional false and node PlanServiceNode', () => {
    let bindingsFixture: [];
    let isOptionalFixture: false;
    let nodeFixture: PlanServiceNode;

    beforeAll(() => {
      bindingsFixture = [];
      isOptionalFixture = false;
      nodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: 'service-identifier',
      };
    });

    describe('when called, and isPlanServiceRedirectionBindingNode() returns true', () => {
      let stringifiedServiceIdentifier: string;

      let result: unknown;

      beforeAll(() => {
        stringifiedServiceIdentifier = 'stringified-service-id';

        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        (
          stringifyServiceIdentifier as jest.Mock<
            typeof stringifyServiceIdentifier
          >
        )
          .mockReturnValueOnce(stringifiedServiceIdentifier)
          .mockReturnValueOnce(stringifiedServiceIdentifier);

        try {
          throwErrorWhenUnexpectedBindingsAmountFound(
            bindingsFixture,
            isOptionalFixture,
            nodeFixture,
          );
        } catch (error) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw InversifyCoreError', () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.planning,
          message: `No bindings found for service: "${stringifiedServiceIdentifier}".

Trying to resolve bindings for "${stringifiedServiceIdentifier} (Root service)".`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });

  describe('having bindings empty array and isOptional true and node PlanServiceNode', () => {
    let bindingsFixture: [];
    let isOptionalFixture: true;
    let nodeFixture: PlanServiceNode;

    beforeAll(() => {
      bindingsFixture = [];
      isOptionalFixture = true;
      nodeFixture = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: 'service-identifier',
      };
    });

    describe('when called, and isPlanServiceRedirectionBindingNode() returns true', () => {
      let result: unknown;

      beforeAll(() => {
        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        result = throwErrorWhenUnexpectedBindingsAmountFound(
          bindingsFixture,
          isOptionalFixture,
          nodeFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having multiple bindings and node PlanServiceRedirectionBindingNode', () => {
    let bindingsFixture: PlanBindingNode[];
    let isOptionalFixture: boolean;
    let nodeFixture: PlanServiceRedirectionBindingNode;

    beforeAll(() => {
      const parentNode: PlanServiceNode = {
        bindings: [],
        parent: undefined,
        serviceIdentifier: 'target-service-id',
      };

      bindingsFixture = [
        {
          binding: {
            cache: {
              isRight: true,
              value: Symbol(),
            },
            id: 0,
            isSatisfiedBy: () => true,
            moduleId: undefined,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: bindingScopeValues.Singleton,
            serviceIdentifier: 'target-service-id',
            type: bindingTypeValues.ConstantValue,
            value: Symbol(),
          },
          parent: parentNode,
        },
        {
          binding: {
            cache: {
              isRight: true,
              value: Symbol(),
            },
            id: 0,
            isSatisfiedBy: () => true,
            moduleId: undefined,
            onActivation: undefined,
            onDeactivation: undefined,
            scope: bindingScopeValues.Singleton,
            serviceIdentifier: 'target-service-id',
            type: bindingTypeValues.ConstantValue,
            value: Symbol(),
          },
          parent: parentNode,
        },
      ];
      isOptionalFixture = false;
      nodeFixture = {
        binding: {
          id: 1,
          isSatisfiedBy: () => true,
          moduleId: undefined,
          serviceIdentifier: 'service-id',
          targetServiceIdentifier: 'target-service-id',
          type: bindingTypeValues.ServiceRedirection,
        },
        parent: {
          bindings: [],
          parent: undefined,
          serviceIdentifier: 'service-id',
        },
        redirections: [],
      };
    });

    describe('when called, and isPlanServiceRedirectionBindingNode() returns true', () => {
      let stringifiedTargetServiceIdentifierFixture: string;
      let stringifiedServiceIdentifierFixture: string;

      let stringifiedBindingFixture: string;

      let result: unknown;

      beforeAll(() => {
        stringifiedTargetServiceIdentifierFixture =
          'stringified-target-service-id';
        stringifiedServiceIdentifierFixture = 'stringified-service-id';

        stringifiedBindingFixture = 'stringified-binding';

        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(true);

        (
          stringifyServiceIdentifier as jest.Mock<
            typeof stringifyServiceIdentifier
          >
        )
          .mockReturnValueOnce(stringifiedTargetServiceIdentifierFixture)
          .mockReturnValueOnce(stringifiedServiceIdentifierFixture);

        (stringifyBinding as jest.Mock<typeof stringifyBinding>)
          .mockReturnValueOnce(stringifiedBindingFixture)
          .mockReturnValueOnce(stringifiedBindingFixture);

        try {
          result = throwErrorWhenUnexpectedBindingsAmountFound(
            bindingsFixture,
            isOptionalFixture,
            nodeFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should throw InversifyCoreError', () => {
        const expectedErrorProperties: Partial<InversifyCoreError> = {
          kind: InversifyCoreErrorKind.planning,
          message: `Ambiguous bindings found for service: "${stringifiedTargetServiceIdentifierFixture}".

Registered bindings:

${stringifiedBindingFixture}
${stringifiedBindingFixture}

Trying to resolve bindings for "${stringifiedServiceIdentifierFixture}".`,
        };

        expect(result).toBeInstanceOf(InversifyCoreError);
        expect(result).toStrictEqual(
          expect.objectContaining(expectedErrorProperties),
        );
      });
    });
  });
});
