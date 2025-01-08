import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithServiceId');
jest.mock('./isParentBindingMetadata');

import { ServiceIdentifier } from '@inversifyjs/common';

import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';
import { isParentBindingMetadata } from './isParentBindingMetadata';
import { isParentBindingMetadataWithServiceId } from './isParentBindingMetadataWithServiceId';

describe(isParentBindingMetadataWithServiceId.name, () => {
  let serviceIdFixture: ServiceIdentifier;

  beforeAll(() => {
    serviceIdFixture = 'name-fixture';
  });

  describe('when called', () => {
    let isBindingMetadataWithNameResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;
    let isParentBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isParentBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithServiceId as jest.Mock<
          typeof isBindingMetadataWithServiceId
        >
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isParentBindingMetadata as jest.Mock<typeof isParentBindingMetadata>
      ).mockReturnValueOnce(isParentBindingMetadataResultMock);

      result = isParentBindingMetadataWithServiceId(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call isBindingMetadataWithServiceId()', () => {
      expect(isBindingMetadataWithServiceId).toHaveBeenCalledTimes(1);
      expect(isBindingMetadataWithServiceId).toHaveBeenCalledWith(
        serviceIdFixture,
      );
    });

    it('should call isParentBindingMetadata()', () => {
      expect(isParentBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isParentBindingMetadata).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isParentBindingMetadataResultMock);
    });
  });
});
