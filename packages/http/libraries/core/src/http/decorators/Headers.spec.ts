import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('../calculations/requestParamFactory');

import { requestParamFactory } from '../calculations/requestParamFactory';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { headers } from './Headers';

describe(headers.name, () => {
  describe('when called', () => {
    let parameterNameFixture: string | undefined;
    let parameterDecoratorFixture: ParameterDecorator;
    let result: unknown;

    beforeAll(() => {
      parameterNameFixture = undefined;
      parameterDecoratorFixture = {} as ParameterDecorator;

      vitest
        .mocked(requestParamFactory)
        .mockReturnValueOnce(parameterDecoratorFixture);

      result = headers(parameterNameFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call requestParamFactory', () => {
      expect(requestParamFactory).toHaveBeenCalledTimes(1);
      expect(requestParamFactory).toHaveBeenCalledWith(
        RequestMethodParameterType.HEADERS,
        [],
        parameterNameFixture,
      );
    });

    it('should return a ParameterDecorator', () => {
      expect(result).toBe(parameterDecoratorFixture);
    });
  });
});
