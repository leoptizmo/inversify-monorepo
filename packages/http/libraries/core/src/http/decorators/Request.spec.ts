import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('../calculations/requestParamFactory');

import { requestParamFactory } from '../calculations/requestParamFactory';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { request } from './Request';

describe(request.name, () => {
  describe('when called', () => {
    let parameterDecoratorFixture: ParameterDecorator;
    let result: unknown;

    beforeAll(() => {
      parameterDecoratorFixture = {} as ParameterDecorator;

      vitest
        .mocked(requestParamFactory)
        .mockReturnValueOnce(parameterDecoratorFixture);

      result = request();
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call requestParamFactory', () => {
      expect(requestParamFactory).toHaveBeenCalledTimes(1);
      expect(requestParamFactory).toHaveBeenCalledWith(
        RequestMethodParameterType.REQUEST,
        [],
      );
    });

    it('should return a ParameterDecorator', () => {
      expect(result).toBe(parameterDecoratorFixture);
    });
  });
});
