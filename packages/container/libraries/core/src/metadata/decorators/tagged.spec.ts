import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock(
  '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata',
);
jest.mock('./injectBase');

import { incrementPendingClassMetadataCount } from '../actions/incrementPendingClassMetadataCount';
import { buildMaybeClassElementMetadataFromMaybeClassElementMetadata } from '../calculations/buildMaybeClassElementMetadataFromMaybeClassElementMetadata';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';
import { injectBase } from './injectBase';
import { tagged } from './tagged';

describe(tagged.name, () => {
  let keyFixture: string;
  let valueFixture: unknown;

  beforeAll(() => {
    keyFixture = 'key-fixture';
    valueFixture = 'value-fixture';
  });

  describe('when called', () => {
    let decoratorFixture: MethodDecorator &
      ParameterDecorator &
      PropertyDecorator;
    let updateMetadataMock: jest.Mock<
      (
        classElementMetadata: MaybeClassElementMetadata | undefined,
      ) => ManagedClassElementMetadata | MaybeManagedClassElementMetadata
    >;

    let result: unknown;

    beforeAll(() => {
      decoratorFixture = Symbol() as unknown as MethodDecorator &
        ParameterDecorator &
        PropertyDecorator;
      updateMetadataMock = jest.fn();

      (
        buildMaybeClassElementMetadataFromMaybeClassElementMetadata as jest.Mock<
          typeof buildMaybeClassElementMetadataFromMaybeClassElementMetadata
        >
      ).mockReturnValueOnce(updateMetadataMock);

      (injectBase as jest.Mock).mockReturnValueOnce(decoratorFixture);

      result = tagged(keyFixture, valueFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call buildMaybeClassElementMetadataFromMaybeClassElementMetadata()', () => {
      expect(
        buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
      ).toHaveBeenCalledTimes(1);
      expect(
        buildMaybeClassElementMetadataFromMaybeClassElementMetadata,
      ).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should call injectBase()', () => {
      expect(injectBase).toHaveBeenCalledTimes(1);
      expect(injectBase).toHaveBeenCalledWith(
        updateMetadataMock,
        incrementPendingClassMetadataCount,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(decoratorFixture);
    });
  });
});
