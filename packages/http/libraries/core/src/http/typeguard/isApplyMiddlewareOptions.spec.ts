import { beforeAll, describe, expect, it } from 'vitest';

import { Newable } from 'inversify';

import { Middleware } from '../middleware/model/Middleware';
import { MiddlewarePhase } from '../middleware/model/MiddlewarePhase';
import { ApplyMiddlewareOptions } from '../models/ApplyMiddlewareOptions';
import { isApplyMiddlewareOptions } from './isApplyMiddlewareOptions';

class TestMiddleware implements Middleware {
  public execute(_request: Request, _response: Response): void {
    throw new Error('Method not implemented.');
  }
}

describe(isApplyMiddlewareOptions.name, () => {
  describe('having a value undefined', () => {
    describe('when called', () => {
      let valueFixture: undefined;
      let result: boolean;

      beforeAll(() => {
        valueFixture = undefined;

        result = isApplyMiddlewareOptions(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a value null', () => {
    describe('when called', () => {
      let valueFixture: null;
      let result: boolean;

      beforeAll(() => {
        valueFixture = null;

        result = isApplyMiddlewareOptions(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a value with no middleware property', () => {
    describe('when called', () => {
      let valueFixture: object;
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

  describe('having a value with non function middleware property', () => {
    describe('when called', () => {
      let valueFixture: { middleware: string };
      let result: boolean;

      beforeAll(() => {
        valueFixture = { middleware: 'not a function' };

        result = isApplyMiddlewareOptions(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a value with non string phase property', () => {
    describe('when called', () => {
      let valueFixture: {
        middleware: Newable<Middleware>;
        phase: number;
      };
      let result: boolean;

      beforeAll(() => {
        valueFixture = {
          middleware: TestMiddleware,
          phase: 2,
        };

        result = isApplyMiddlewareOptions(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a value that is ApplyMiddlewareOptions', () => {
    describe('when called', () => {
      let valueFixture: ApplyMiddlewareOptions;
      let result: boolean;

      beforeAll(() => {
        valueFixture = {
          middleware: TestMiddleware,
          phase: MiddlewarePhase.PreHandler,
        };

        result = isApplyMiddlewareOptions(valueFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });
});
