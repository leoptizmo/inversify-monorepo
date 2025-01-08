import { beforeAll, describe, expect, it } from '@jest/globals';

import { BindingMetadata, MetadataName } from '@inversifyjs/core';

import { isBindingMetadataWithName } from './isBindingMetadataWithName';

describe(isBindingMetadataWithName.name, () => {
  describe('having a BindingMetadata with same name as name', () => {
    let nameFixture: MetadataName;

    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      nameFixture = 'name-fixture';

      bindingMetadataFixture = {
        name: nameFixture,
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithName(nameFixture)(bindingMetadataFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('having a BindingMetadata with different name than name', () => {
    let nameFixture: MetadataName;

    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      nameFixture = 'name-fixture';

      bindingMetadataFixture = {
        name: 'another-name-fixture',
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithName(nameFixture)(bindingMetadataFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
