import { beforeAll, describe, expect, it } from 'vitest';

import { ApplyMiddlewareOptions } from '../models/ApplyMiddlewareOptions';
import { Middleware } from '../models/Middleware';
import { isApplyMiddlewareOptions } from './isApplyMiddlewareOptions';

class TestMiddleware implements Middleware {
  public execute(_request: Request, _response: Response): void {
    throw new Error('Method not implemented.');
  }
}

describe(isApplyMiddlewareOptions.name, () => {
  describe('having a value that is ApplyMiddlewareOptions', () => {
    describe('when called', () => {
      let valueFixture: ApplyMiddlewareOptions;
      let result: boolean;

      beforeAll(() => {
        valueFixture = {
          middleware: TestMiddleware,
          phase: 'preHandler',
        };

        result = isApplyMiddlewareOptions(valueFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('having a value that is not ApplyMiddlewareOptions', () => {
    describe('when called', () => {
      let valueFixture: unknown;
      let result: boolean;

      beforeAll(() => {
        valueFixture = {};

        result = isApplyMiddlewareOptions(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
