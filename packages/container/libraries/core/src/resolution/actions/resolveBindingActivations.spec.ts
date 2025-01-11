import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./resolveBindingServiceActivations');

import { ConstantValueBindingFixtures } from '../../binding/fixtures/ConstantValueBindingFixtures';
import { ConstantValueBinding } from '../../binding/models/ConstantValueBinding';
import { ResolutionContext } from '../models/ResolutionContext';
import { ResolutionParams } from '../models/ResolutionParams';
import { resolveBindingActivations } from './resolveBindingActivations';
import { resolveBindingServiceActivations } from './resolveBindingServiceActivations';

describe(resolveBindingActivations.name, () => {
  describe('having a binding with no activation', () => {
    let paramsMock: jest.Mocked<ResolutionParams>;
    let bindingFixture: ConstantValueBinding<unknown>;
    let resolvedValueFixture: unknown;

    beforeAll(() => {
      paramsMock = {
        getActivations: jest.fn(),
        getBindings: jest.fn(),
      } as Partial<
        jest.Mocked<ResolutionParams>
      > as jest.Mocked<ResolutionParams>;
      bindingFixture = ConstantValueBindingFixtures.withOnActivationUndefined;
      resolvedValueFixture = Symbol();
    });

    describe('when called', () => {
      let resolveBindingServiceActivationsResultFixture: unknown;
      let result: unknown;

      beforeAll(() => {
        resolveBindingServiceActivationsResultFixture = Symbol();

        (
          resolveBindingServiceActivations as jest.Mock<
            typeof resolveBindingServiceActivations
          >
        ).mockReturnValueOnce(resolveBindingServiceActivationsResultFixture);

        result = resolveBindingActivations(
          paramsMock,
          bindingFixture,
          resolvedValueFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call resolveBindingServiceActivations()', () => {
        expect(resolveBindingServiceActivations).toHaveBeenCalledTimes(1);
        expect(resolveBindingServiceActivations).toHaveBeenCalledWith(
          paramsMock,
          bindingFixture.serviceIdentifier,
          resolvedValueFixture,
        );
      });

      it('should return expected result', () => {
        expect(result).toBe(resolveBindingServiceActivationsResultFixture);
      });
    });
  });

  describe('having a binding with activation', () => {
    let onActivationMock: jest.Mock<(value: unknown) => unknown>;
    let paramsMock: jest.Mocked<ResolutionParams>;
    let bindingFixture: ConstantValueBinding<unknown>;
    let resolvedValue: unknown;

    beforeAll(() => {
      onActivationMock = jest.fn();
      paramsMock = {
        context: Symbol() as unknown as jest.Mocked<ResolutionContext>,
        getActivations: jest.fn(),
        getBindings: jest.fn(),
      } as Partial<
        jest.Mocked<ResolutionParams>
      > as jest.Mocked<ResolutionParams>;
      bindingFixture = {
        ...ConstantValueBindingFixtures.any,
        onActivation: onActivationMock,
      };
      resolvedValue = Symbol();
    });

    describe('when called', () => {
      let onActivationResultFixture: unknown;
      let resolveBindingServiceActivationsResultFixture: unknown;
      let result: unknown;

      beforeAll(() => {
        onActivationResultFixture = Symbol();
        resolveBindingServiceActivationsResultFixture = Symbol();

        onActivationMock.mockReturnValueOnce(onActivationResultFixture);

        (
          resolveBindingServiceActivations as jest.Mock<
            typeof resolveBindingServiceActivations
          >
        ).mockReturnValueOnce(resolveBindingServiceActivationsResultFixture);

        result = resolveBindingActivations(
          paramsMock,
          bindingFixture,
          resolvedValue,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call binding.onActivation()', () => {
        expect(onActivationMock).toHaveBeenCalledTimes(1);
        expect(onActivationMock).toHaveBeenCalledWith(
          paramsMock.context,
          resolvedValue,
        );
      });

      it('should call resolveBindingServiceActivations()', () => {
        expect(resolveBindingServiceActivations).toHaveBeenCalledTimes(1);
        expect(resolveBindingServiceActivations).toHaveBeenCalledWith(
          paramsMock,
          bindingFixture.serviceIdentifier,
          onActivationResultFixture,
        );
      });

      it('should return expected result', () => {
        expect(result).toBe(resolveBindingServiceActivationsResultFixture);
      });
    });
  });
});
