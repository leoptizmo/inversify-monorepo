import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithServiceId');
jest.mock('./isNotParentBindingMetadata');

import { ServiceIdentifier } from '@inversifyjs/common';

import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';
import { isNotParentBindingMetadata } from './isNotParentBindingMetadata';
import { isNotParentBindingMetadataWithServiceId } from './isNotParentBindingMetadataWithServiceId';

describe(isNotParentBindingMetadataWithServiceId.name, () => {
  let serviceIdFixture: ServiceIdentifier;

  beforeAll(() => {
    serviceIdFixture = 'name-fixture';
  });

  describe('when called', () => {
    let isBindingMetadataWithNameResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;
    let isNotParentBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isNotParentBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithServiceId as jest.Mock<
          typeof isBindingMetadataWithServiceId
        >
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isNotParentBindingMetadata as jest.Mock<
          typeof isNotParentBindingMetadata
        >
      ).mockReturnValueOnce(isNotParentBindingMetadataResultMock);

      result = isNotParentBindingMetadataWithServiceId(serviceIdFixture);
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

    it('should call isNotParentBindingMetadata()', () => {
      expect(isNotParentBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isNotParentBindingMetadata).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isNotParentBindingMetadataResultMock);
    });
  });
});
