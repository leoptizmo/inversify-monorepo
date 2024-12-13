import { beforeAll, describe, expect, it } from '@jest/globals';

import { BindingMetadata } from './BindingMetadata';
import {
  BindingMetadataImplementation,
  InternalBindingMetadata,
} from './BindingMetadataImplementation';

describe(BindingMetadataImplementation, () => {
  let internalBindingMetadataFixture: InternalBindingMetadata;
  let bindingMetadataImplementationFixture: BindingMetadataImplementation;

  beforeAll(() => {
    internalBindingMetadataFixture = {
      name: undefined,
      serviceIdentifier: 'service-id',
      tags: new Map(),
    };
    bindingMetadataImplementationFixture = new BindingMetadataImplementation({
      elem: internalBindingMetadataFixture,
      previous: undefined,
    });
  });

  describe('.name', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = bindingMetadataImplementationFixture.name;
      });

      it('should return expected result', () => {
        expect(result).toBe(internalBindingMetadataFixture.name);
      });
    });
  });

  describe('.serviceIdentifier', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = bindingMetadataImplementationFixture.serviceIdentifier;
      });

      it('should return expected result', () => {
        expect(result).toBe(internalBindingMetadataFixture.serviceIdentifier);
      });
    });
  });

  describe('.tags', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = bindingMetadataImplementationFixture.tags;
      });

      it('should return expected result', () => {
        expect(result).toBe(internalBindingMetadataFixture.tags);
      });
    });
  });

  describe('.getAncestors', () => {
    describe('having a bindingMetadataImplementation with no ancestors', () => {
      let internalBindingMetadataFixture: InternalBindingMetadata;
      let bindingMetadataImplementationFixture: BindingMetadataImplementation;

      beforeAll(() => {
        internalBindingMetadataFixture = {
          name: undefined,
          serviceIdentifier: 'service-id',
          tags: new Map(),
        };
        bindingMetadataImplementationFixture =
          new BindingMetadataImplementation({
            elem: internalBindingMetadataFixture,
            previous: undefined,
          });
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = bindingMetadataImplementationFixture.getAncestor();
        });

        it('should return expected result', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('having a bindingMetadataImplementation with ancestors', () => {
      let ancestorInternalBindingMetadataFixture: InternalBindingMetadata;
      let internalBindingMetadataFixture: InternalBindingMetadata;
      let bindingMetadataImplementationFixture: BindingMetadataImplementation;

      beforeAll(() => {
        ancestorInternalBindingMetadataFixture = {
          name: 'ancestor-name',
          serviceIdentifier: 'ancestor-service-id',
          tags: new Map([['foo', 'bar']]),
        };
        internalBindingMetadataFixture = {
          name: undefined,
          serviceIdentifier: 'service-id',
          tags: new Map(),
        };
        bindingMetadataImplementationFixture =
          new BindingMetadataImplementation({
            elem: internalBindingMetadataFixture,
            previous: {
              elem: ancestorInternalBindingMetadataFixture,
              previous: undefined,
            },
          });
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = bindingMetadataImplementationFixture.getAncestor();
        });

        it('should return expected result', () => {
          const expected: Partial<BindingMetadata> = {
            ...ancestorInternalBindingMetadataFixture,
            getAncestor: expect.any(Function) as unknown as () =>
              | BindingMetadata
              | undefined,
          };

          expect(result).toStrictEqual(expect.objectContaining(expected));
        });
      });
    });
  });
});
