import { beforeAll, describe, expect, it } from '@jest/globals';

import { BindingMetadata, MetadataName } from '@inversifyjs/core';

import { isBindingMetadataWithTag } from './isBindingMetadataWithTag';

describe(isBindingMetadataWithTag.name, () => {
  describe('having a BindingMetadata with same tag and tag value', () => {
    let tagFixture: MetadataName;
    let tagValueFixture: unknown;

    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      tagFixture = 'name-fixture';
      tagValueFixture = Symbol();

      bindingMetadataFixture = {
        tags: new Map([[tagFixture, tagValueFixture]]),
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithTag(
          tagFixture,
          tagValueFixture,
        )(bindingMetadataFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('having a BindingMetadata with same tag but different tag value', () => {
    let tagFixture: MetadataName;
    let tagValueFixture: unknown;

    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      tagFixture = 'name-fixture';
      tagValueFixture = Symbol();

      bindingMetadataFixture = {
        tags: new Map([[tagFixture, Symbol()]]),
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithTag(
          tagFixture,
          tagValueFixture,
        )(bindingMetadataFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a BindingMetadata with no different tag', () => {
    let tagFixture: MetadataName;
    let tagValueFixture: unknown;

    let bindingMetadataFixture: BindingMetadata;

    beforeAll(() => {
      tagFixture = 'name-fixture';
      tagValueFixture = Symbol();

      bindingMetadataFixture = {
        tags: new Map(),
      } as Partial<BindingMetadata> as BindingMetadata;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isBindingMetadataWithTag(
          tagFixture,
          tagValueFixture,
        )(bindingMetadataFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
