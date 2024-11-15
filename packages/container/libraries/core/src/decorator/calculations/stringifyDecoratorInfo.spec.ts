import { beforeAll, describe, expect, it } from '@jest/globals';

import { DecoratorInfoKind } from '../models/DecoratorInfoKind';
import { ParameterDecoratorInfo } from '../models/ParameterDecoratorInfo';
import { PropertyDecoratorInfo } from '../models/PropertyDecoratorInfo';
import { stringifyDecoratorInfo } from './stringifyDecoratorInfo';

describe(stringifyDecoratorInfo.name, () => {
  describe('having decoratorTargetInfo with kind parameters', () => {
    let decoratorTargetInfoFixture: ParameterDecoratorInfo;

    beforeAll(() => {
      decoratorTargetInfoFixture = {
        index: 0,
        kind: DecoratorInfoKind.parameter,
        targetClass: class Name {},
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = stringifyDecoratorInfo(decoratorTargetInfoFixture);
      });

      it('should return expected string', () => {
        expect(result).toBe('[class: "Name", index: "0"]');
      });
    });
  });

  describe('having decoratorTargetInfo with property parameters', () => {
    let decoratorTargetInfoFixture: PropertyDecoratorInfo;

    beforeAll(() => {
      decoratorTargetInfoFixture = {
        kind: DecoratorInfoKind.property,
        property: 'property',
        targetClass: class Name {},
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = stringifyDecoratorInfo(decoratorTargetInfoFixture);
      });

      it('should return expected string', () => {
        expect(result).toBe('[class: "Name", property: "property"]');
      });
    });
  });
});
