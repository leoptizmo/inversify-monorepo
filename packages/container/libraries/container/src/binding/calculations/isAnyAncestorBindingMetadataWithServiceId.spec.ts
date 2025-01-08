import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import { BindingMetadata } from '@inversifyjs/core';

jest.mock('./isBindingMetadataWithServiceId');
jest.mock('./isAnyAncestorBindingMetadata');

import { ServiceIdentifier } from '@inversifyjs/common';

import { isAnyAncestorBindingMetadata } from './isAnyAncestorBindingMetadata';
import { isAnyAncestorBindingMetadataWithServiceId } from './isAnyAncestorBindingMetadataWithServiceId';
import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';

describe(isAnyAncestorBindingMetadataWithServiceId.name, () => {
  let serviceIdFixture: ServiceIdentifier;

  beforeAll(() => {
    serviceIdFixture = 'name-fixture';
  });

  describe('when called', () => {
    let isBindingMetadataWithNameResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;
    let isAnyAncestorBindingMetadataResultMock: jest.Mock<
      (metadata: BindingMetadata) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingMetadataWithNameResultMock = jest.fn();
      isAnyAncestorBindingMetadataResultMock = jest.fn();

      (
        isBindingMetadataWithServiceId as jest.Mock<
          typeof isBindingMetadataWithServiceId
        >
      ).mockReturnValueOnce(isBindingMetadataWithNameResultMock);

      (
        isAnyAncestorBindingMetadata as jest.Mock<
          typeof isAnyAncestorBindingMetadata
        >
      ).mockReturnValueOnce(isAnyAncestorBindingMetadataResultMock);

      result = isAnyAncestorBindingMetadataWithServiceId(serviceIdFixture);
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

    it('should call isAnyAncestorBindingMetadata()', () => {
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledTimes(1);
      expect(isAnyAncestorBindingMetadata).toHaveBeenCalledWith(
        isBindingMetadataWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isAnyAncestorBindingMetadataResultMock);
    });
  });
});
