import { beforeAll, describe, expect, it } from '@jest/globals';

import { BindingMetadata } from '@inversifyjs/core';

import { isBindingMetadataWithNoNameNorTags } from './isBindingMetadataWithNoNameNorTags';

describe(isBindingMetadataWithNoNameNorTags.name, () => {
  describe('having a BindingMetadata with name', () => {
    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      bindingMetadataFixture = {
        name: 'name-fixture',
        tags: new Map(),
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithNoNameNorTags(bindingMetadataFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a BindingMetadata with tag', () => {
    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      bindingMetadataFixture = {
        tags: new Map([['tag', Symbol()]]),
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithNoNameNorTags(bindingMetadataFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a BindingMetadata with no name nor tags', () => {
    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      bindingMetadataFixture = {
        name: undefined,
        tags: new Map(),
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithNoNameNorTags(bindingMetadataFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });
});
