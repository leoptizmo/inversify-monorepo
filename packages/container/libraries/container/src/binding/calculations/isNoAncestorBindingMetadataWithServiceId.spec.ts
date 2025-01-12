import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithServiceId');
jest.mock('./isNoAncestorBindingMetadata');

import { ServiceIdentifier } from '@inversifyjs/common';

import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';
import { isNoAncestorBindingMetadata } from './isNoAncestorBindingMetadata';
import { isNoAncestorBindingMetadataWithServiceId } from './isNoAncestorBindingMetadataWithServiceId';

describe(isNoAncestorBindingMetadataWithServiceId.name, () => {
  let serviceIdFixture: ServiceIdentifier;

  beforeAll(() => {
    serviceIdFixture = 'name-fixture';
  });

  describe('when called', () => {
    let isBindingMetadataWithNameResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;
    let isNoAncestorBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isNoAncestorBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithServiceId as jest.Mock<
          typeof isBindingMetadataWithServiceId
        >
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isNoAncestorBindingMetadata as jest.Mock<
          typeof isNoAncestorBindingMetadata
        >
      ).mockReturnValueOnce(isNoAncestorBindingMetadataResultMock);

      result = isNoAncestorBindingMetadataWithServiceId(serviceIdFixture);
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

    it('should call isNoAncestorBindingMetadata()', () => {
      expect(isNoAncestorBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isNoAncestorBindingMetadata).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isNoAncestorBindingMetadataResultMock);
    });
  });
});
