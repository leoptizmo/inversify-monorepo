import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock(
  '../calculations/buildUnmanagedMetadataFromMaybeClassElementMetadata',
);
jest.mock('./injectBase');

import { decrementPendingClassMetadataCount } from '../actions/decrementPendingClassMetadataCount';
import { buildUnmanagedMetadataFromMaybeClassElementMetadata } from '../calculations/buildUnmanagedMetadataFromMaybeClassElementMetadata';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { injectBase } from './injectBase';
import { unmanaged } from './unmanaged';

describe(unmanaged.name, () => {
  describe('when called', () => {
    let decoratorFixture: MethodDecorator &
      ParameterDecorator &
      PropertyDecorator;
    let updateMetadataMock: jest.Mock<
      (
        classElementMetadata: MaybeClassElementMetadata | undefined,
      ) => ClassElementMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      decoratorFixture = Symbol() as unknown as MethodDecorator &
        ParameterDecorator &
        PropertyDecorator;
      updateMetadataMock = jest.fn();

      (
        buildUnmanagedMetadataFromMaybeClassElementMetadata as jest.Mock<
          typeof buildUnmanagedMetadataFromMaybeClassElementMetadata
        >
      ).mockReturnValueOnce(updateMetadataMock);

      (injectBase as jest.Mock).mockReturnValueOnce(decoratorFixture);

      result = unmanaged();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call buildUnmanagedMetadataFromMaybeClassElementMetadata()', () => {
      expect(
        buildUnmanagedMetadataFromMaybeClassElementMetadata,
      ).toHaveBeenCalledTimes(1);
      expect(
        buildUnmanagedMetadataFromMaybeClassElementMetadata,
      ).toHaveBeenCalledWith();
    });

    it('should call injectBase()', () => {
      expect(injectBase).toHaveBeenCalledTimes(1);
      expect(injectBase).toHaveBeenCalledWith(
        updateMetadataMock,
        decrementPendingClassMetadataCount,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(decoratorFixture);
    });
  });
});
