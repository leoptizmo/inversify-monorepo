import {
  assertType,
  beforeAll,
  describe,
  expectTypeOf,
  it,
  Mocked,
  vitest,
} from 'vitest';

import { Newable, ServiceIdentifier } from '@inversifyjs/common';

import {
  BindInWhenOnFluentSyntax,
  BindToFluentSyntax,
} from './BindingFluentSyntax';

describe('BindToFluentSyntax', () => {
  let bindToFluentSyntaxMock: Mocked<BindToFluentSyntax<unknown>>;

  beforeAll(() => {
    bindToFluentSyntaxMock = {
      toResolvedValue: vitest.fn() as unknown,
    } as Partial<Mocked<BindToFluentSyntax<unknown>>> as Mocked<
      BindToFluentSyntax<unknown>
    >;
  });

  describe('.toResolvedValue', () => {
    describe('having a factory with a fixed number of primitive arguments', () => {
      let factoryFixture: (arg1: string, arg2: number) => unknown;

      beforeAll(() => {
        factoryFixture = (arg1: string, arg2: number): unknown => {
          return { arg1, arg2 };
        };
      });

      it('when called, with no inject options, should throw a syntax error', () => {
        // @ts-expect-error :: Inject options are required
        assertType(bindToFluentSyntaxMock.toResolvedValue(factoryFixture));
      });

      it('when called, with less right inject options than function parameters, should throw a syntax error', () => {
        const firstServiceIdentifier: ServiceIdentifier<string> = Symbol();

        assertType(
          // @ts-expect-error :: Too few inject options are provided
          bindToFluentSyntaxMock.toResolvedValue(factoryFixture, [
            firstServiceIdentifier,
          ]),
        );
      });

      it('when called, with as many right inject options as function parameters, should not throw a syntax error', () => {
        const firstServiceIdentifier: ServiceIdentifier<string> = Symbol();
        const secondServiceIdentifier: ServiceIdentifier<number> = Symbol();

        expectTypeOf(
          bindToFluentSyntaxMock.toResolvedValue(factoryFixture, [
            firstServiceIdentifier,
            secondServiceIdentifier,
          ]),
        ).toEqualTypeOf<BindInWhenOnFluentSyntax<unknown>>();
      });

      it('when called, with as many "wrong" inject options as function parameters, should not throw a syntax error', () => {
        const firstServiceIdentifier: ServiceIdentifier<number> =
          Symbol() as ServiceIdentifier<number>;

        // Unlucky us, Newable<T> extends Function and therefore, it extends ServiceIdentifier<T2>
        const secondServiceIdentifier: Newable<object> = Object;

        expectTypeOf(
          bindToFluentSyntaxMock.toResolvedValue(factoryFixture, [
            firstServiceIdentifier,
            secondServiceIdentifier,
          ]),
        ).toEqualTypeOf<BindInWhenOnFluentSyntax<unknown>>();
      });

      it('when called, with more right inject options than function parameters, should throw a syntax error', () => {
        const firstServiceIdentifier: ServiceIdentifier<string> = Symbol();
        const secondServiceIdentifier: ServiceIdentifier<string> = Symbol();
        const thirdServiceIdentifier: ServiceIdentifier<string> = Symbol();

        assertType(
          // @ts-expect-error :: Too many inject options are provided
          bindToFluentSyntaxMock.toResolvedValue(factoryFixture, [
            firstServiceIdentifier,
            secondServiceIdentifier,
            thirdServiceIdentifier,
          ]),
        );
      });
    });
  });
});
