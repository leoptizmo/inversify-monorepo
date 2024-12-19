import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import { updateReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import {
  BindingScope,
  bindingScopeValues,
} from '../../binding/models/BindingScope';
import { classMetadataReflectKey } from '../../reflectMetadata/data/classMetadataReflectKey';
import { getDefaultClassMetadata } from '../calculations/getDefaultClassMetadata';
import { injectable } from './injectable';

describe(injectable.name, () => {
  describe('having undefined binding scope', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = injectable()(class {});
      });

      it('should not call updateReflectMetadata()', () => {
        expect(updateReflectMetadata).not.toHaveBeenCalled();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having non undefined binding scope', () => {
    class Foo {}

    let bindingScopeFixture: BindingScope;

    beforeAll(() => {
      bindingScopeFixture = bindingScopeValues.Request;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = injectable(bindingScopeFixture)(Foo);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call updateReflectMetadata()', () => {
        expect(updateReflectMetadata).toHaveBeenCalledTimes(1);
        expect(updateReflectMetadata).toHaveBeenCalledWith(
          Foo,
          classMetadataReflectKey,
          getDefaultClassMetadata,
          expect.any(Function),
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
