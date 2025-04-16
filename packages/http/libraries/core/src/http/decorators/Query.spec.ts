import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('../calculations/requestParamFactory');

import { requestParamFactory } from '../calculations/requestParamFactory';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { query } from './Query';

describe(query.name, () => {
  describe('when called', () => {
    let parameterFixture: undefined;
    let parameterDecoratorFixture: ParameterDecorator;
    let result: unknown;

    beforeAll(() => {
      parameterFixture = undefined;
      parameterDecoratorFixture = {} as ParameterDecorator;

      vitest
        .mocked(requestParamFactory)
        .mockReturnValueOnce(parameterDecoratorFixture);

      result = query(parameterFixture);
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call requestParam', () => {
      expect(requestParamFactory).toHaveBeenCalledTimes(1);
      expect(requestParamFactory).toHaveBeenCalledWith(
        RequestMethodParameterType.QUERY,
        [],
        parameterFixture,
      );
    });

    it('should return a ParameterDecorator', () => {
      expect(result).toBe(parameterDecoratorFixture);
    });
  });
});
