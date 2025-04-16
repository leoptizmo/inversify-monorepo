import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('../calculations/requestParamFactory');

import { CustomParameterDecoratorHandler } from '../models/CustomParameterDecoratorHandler';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { createCustomParameterDecorator } from './createCustomParameterDecorator';
import { requestParamFactory } from './requestParamFactory';

describe(createCustomParameterDecorator.name, () => {
  describe('when called', () => {
    let handlerFixture: CustomParameterDecoratorHandler;
    let parameterDecoratorFixture: ParameterDecorator;
    let result: unknown;

    beforeAll(() => {
      handlerFixture = {} as CustomParameterDecoratorHandler;
      parameterDecoratorFixture = {} as ParameterDecorator;

      vitest
        .mocked(requestParamFactory)
        .mockReturnValueOnce(parameterDecoratorFixture);

      result = createCustomParameterDecorator(handlerFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call requestParamFactory', () => {
      expect(requestParamFactory).toHaveBeenCalledTimes(1);
      expect(requestParamFactory).toHaveBeenCalledWith(
        RequestMethodParameterType.CUSTOM,
        [],
        undefined,
        handlerFixture,
      );
    });

    it('should return a ParameterDecorator', () => {
      expect(result).toBe(parameterDecoratorFixture);
    });
  });
});
