import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { LazyServiceIdentifier } from './LazyServiceIdentifier';
import { ServiceIdentifier } from './ServiceIdentifier';

describe(LazyServiceIdentifier.name, () => {
  let buildServiceIdMock: jest.Mock<() => ServiceIdentifier<unknown>>;

  let lazyServiceIdentifier: LazyServiceIdentifier;

  beforeAll(() => {
    buildServiceIdMock = jest.fn();

    lazyServiceIdentifier = new LazyServiceIdentifier(buildServiceIdMock);
  });

  describe('.is', () => {
    describe('having an object with islazyServiceIdentifierSymbol property', () => {
      let valueFixture: LazyServiceIdentifier;

      beforeAll(() => {
        valueFixture = new LazyServiceIdentifier(() => 'service-id');
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = LazyServiceIdentifier.is(valueFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });
    });

    describe('having an object without islazyServiceIdentifierSymbol property', () => {
      let valueFixture: unknown;

      beforeAll(() => {
        valueFixture = {
          foo: 'bar',
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = LazyServiceIdentifier.is(valueFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });
  });

  describe('.unwrap', () => {
    describe('when called', () => {
      let serviceIdFixure: ServiceIdentifier;

      let result: unknown;

      beforeAll(() => {
        serviceIdFixure = Symbol();

        buildServiceIdMock.mockReturnValueOnce(serviceIdFixure);

        result = lazyServiceIdentifier.unwrap();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildServiceId()', () => {
        expect(buildServiceIdMock).toHaveBeenCalledTimes(1);
        expect(buildServiceIdMock).toHaveBeenCalledWith();
      });

      it('should return expected result', () => {
        expect(result).toBe(serviceIdFixure);
      });
    });
  });
});
