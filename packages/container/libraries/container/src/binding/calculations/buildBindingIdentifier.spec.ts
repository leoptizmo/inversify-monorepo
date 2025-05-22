import { beforeAll, describe, expect, it } from 'vitest';

import {
  BaseBinding,
  BindingType,
  bindingTypeValues,
} from '@gritcode/inversifyjs-core';

import { buildBindingIdentifier } from './buildBindingIdentifier';

describe(buildBindingIdentifier.name, () => {
  let bindingFixture: BaseBinding<BindingType, unknown>;

  beforeAll(() => {
    bindingFixture = {
      id: 1,
      isSatisfiedBy: () => true,
      moduleId: 2,
      serviceIdentifier: Symbol('serviceIdentifier'),
      type: bindingTypeValues.ConstantValue,
    };
  });

  describe('when called', () => {
    let result: unknown;

    beforeAll(() => {
      result = buildBindingIdentifier(bindingFixture);
    });

    it('should return a binding identifier', () => {
      expect(result).toStrictEqual({
        id: bindingFixture.id,
        [Symbol.for('@gritcode/inversifyjs-container/bindingIdentifier')]: true,
      });
    });
  });
});
