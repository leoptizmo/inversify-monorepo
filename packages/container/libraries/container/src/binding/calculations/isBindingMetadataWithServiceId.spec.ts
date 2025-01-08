import { beforeAll, describe, expect, it } from '@jest/globals';

import { ServiceIdentifier } from '@inversifyjs/common';
import { BindingMetadata } from '@inversifyjs/core';

import { isBindingMetadataWithServiceId } from './isBindingMetadataWithServiceId';

describe(isBindingMetadataWithServiceId.name, () => {
  describe('having a BindingMetadata with same serviceId', () => {
    let serviceIdFixture: ServiceIdentifier;

    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      serviceIdFixture = 'service-id-fixture';

      bindingMetadataFixture = {
        serviceIdentifier: serviceIdFixture,
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithServiceId(serviceIdFixture)(
          bindingMetadataFixture,
        );
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('having a BindingMetadata with different serviceId', () => {
    let serviceIdFixture: ServiceIdentifier;

    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      serviceIdFixture = 'service-id-fixture';

      bindingMetadataFixture = {
        serviceIdentifier: 'another-service-id-fixture',
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithServiceId(serviceIdFixture)(
          bindingMetadataFixture,
        );
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
