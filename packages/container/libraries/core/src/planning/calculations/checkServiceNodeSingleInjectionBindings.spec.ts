import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./checkPlanServiceRedirectionBindingNodeSingleInjectionBindings');
jest.mock('./isPlanServiceRedirectionBindingNode');
jest.mock('./throwErrorWhenUnexpectedBindingsAmountFound');

import { PlanBindingNode } from '../models/PlanBindingNode';
import { PlanServiceNode } from '../models/PlanServiceNode';
import { PlanServiceNodeParent } from '../models/PlanServiceNodeParent';
import { checkPlanServiceRedirectionBindingNodeSingleInjectionBindings } from './checkPlanServiceRedirectionBindingNodeSingleInjectionBindings';
import { checkServiceNodeSingleInjectionBindings } from './checkServiceNodeSingleInjectionBindings';
import { isPlanServiceRedirectionBindingNode } from './isPlanServiceRedirectionBindingNode';
import { throwErrorWhenUnexpectedBindingsAmountFound } from './throwErrorWhenUnexpectedBindingsAmountFound';

describe(checkServiceNodeSingleInjectionBindings.name, () => {
  describe('having a PlanServiceNode with no bindings', () => {
    let nodeFixture: PlanServiceNode;
    let isOptionalFixture: boolean;

    beforeAll(() => {
      nodeFixture = {
        bindings: [],
        parent: Symbol() as unknown as PlanServiceNodeParent,
        serviceIdentifier: 'service-id',
      };
      isOptionalFixture = false;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = checkServiceNodeSingleInjectionBindings(
          nodeFixture,
          isOptionalFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call throwErrorWhenUnexpectedBindingsAmountFound()', () => {
        expect(
          throwErrorWhenUnexpectedBindingsAmountFound,
        ).toHaveBeenCalledTimes(1);
        expect(
          throwErrorWhenUnexpectedBindingsAmountFound,
        ).toHaveBeenCalledWith(
          nodeFixture.bindings,
          isOptionalFixture,
          nodeFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a PlanServiceNode with single binding', () => {
    let nodeFixtureBinding: PlanBindingNode;
    let nodeFixture: PlanServiceNode;
    let isOptionalFixture: boolean;

    beforeAll(() => {
      nodeFixtureBinding = Symbol() as unknown as PlanBindingNode;
      nodeFixture = {
        bindings: [nodeFixtureBinding],
        parent: Symbol() as unknown as PlanServiceNodeParent,
        serviceIdentifier: 'service-id',
      };
      isOptionalFixture = false;
    });

    describe('when called, and isPlanServiceRedirectionBindingNode() returns false', () => {
      let result: unknown;

      beforeAll(() => {
        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(false);

        result = checkServiceNodeSingleInjectionBindings(
          nodeFixture,
          isOptionalFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not call throwErrorWhenUnexpectedBindingsAmountFound()', () => {
        expect(
          throwErrorWhenUnexpectedBindingsAmountFound,
        ).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when called, and isPlanServiceRedirectionBindingNode() returns true', () => {
      let result: unknown;

      beforeAll(() => {
        (
          isPlanServiceRedirectionBindingNode as unknown as jest.Mock<
            typeof isPlanServiceRedirectionBindingNode
          >
        ).mockReturnValueOnce(true);

        result = checkServiceNodeSingleInjectionBindings(
          nodeFixture,
          isOptionalFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call checkPlanServiceRedirectionBindingNodeSingleInjectionBindings()', () => {
        expect(
          checkPlanServiceRedirectionBindingNodeSingleInjectionBindings,
        ).toHaveBeenCalledTimes(1);
        expect(
          checkPlanServiceRedirectionBindingNodeSingleInjectionBindings,
        ).toHaveBeenCalledWith(nodeFixtureBinding, isOptionalFixture);
      });

      it('should not call throwErrorWhenUnexpectedBindingsAmountFound()', () => {
        expect(
          throwErrorWhenUnexpectedBindingsAmountFound,
        ).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
