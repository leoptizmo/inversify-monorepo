import { beforeAll, describe, expect, it } from 'vitest';

import { Pipe } from '../pipe/model/Pipe';
import { isPipe } from './isPipe';

describe(isPipe.name, () => {
  describe('having a value undefined', () => {
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

  describe('having a value null', () => {
    describe('when called', () => {
      let valueFixture: null;
      let result: boolean;

      beforeAll(() => {
        valueFixture = null;

        result = isPipe(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a value with no execute property', () => {
    describe('when called', () => {
      let valueFixture: object;
      let result: boolean;

      beforeAll(() => {
        valueFixture = {};

        result = isPipe(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a value with non function execute property', () => {
    describe('when called', () => {
      let valueFixture: { execute: string };
      let result: boolean;

      beforeAll(() => {
        valueFixture = {
          execute: 'not a function',
        };

        result = isPipe(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a value Pipe', () => {
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
});
