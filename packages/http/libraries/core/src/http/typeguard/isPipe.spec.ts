import { beforeAll, describe, expect, it } from 'vitest';

import { Pipe } from '../pipe/model/Pipe';
import { isPipe } from './isPipe';

describe(isPipe.name, () => {
  describe('having a value that is Pipe', () => {
    describe('when called', () => {
      let valueFixture: Pipe;
      let result: boolean;

      beforeAll(() => {
        valueFixture = {
          execute: () => {},
        };

        result = isPipe(valueFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('having a value that is not Pipe', () => {
    describe('when called', () => {
      let valueFixture: unknown;
      let result: boolean;

      beforeAll(() => {
        valueFixture = undefined;

        result = isPipe(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
