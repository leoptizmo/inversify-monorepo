import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');
jest.mock('../actions/updateMetadataMap');

import { updateOwnReflectMetadata } from '@inversifyjs/reflect-metadata-utils';
import { BindInWhenOnFluentSyntax, BindToFluentSyntax } from 'inversify';

import { bindingMetadataMapReflectKey } from '../../reflectMetadata/data/bindingMetadataMapReflectKey';
import { updateMetadataMap } from '../actions/updateMetadataMap';
import { buildDefaultBindingMetadataMap } from '../calculations/buildDefaultBindingMetadataMap';
import { BindingMetadataMap } from '../models/BindingMetadataMap';
import { provide } from './provide';

describe(provide.name, () => {
  describe('having no binding', () => {
    let bindInWhenOnFluentSyntaxFixture: BindInWhenOnFluentSyntax<unknown>;
    let bindToFluentSyntaxMock: jest.Mocked<BindToFluentSyntax<unknown>>;
    let serviceIdentifierFixture: symbol;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    let targetFixture: Function;
    let updateMetadataMapResultFixture: (
      bindingMetadataMap: BindingMetadataMap,
    ) => BindingMetadataMap;

    beforeAll(() => {
      bindInWhenOnFluentSyntaxFixture =
        Symbol() as unknown as BindInWhenOnFluentSyntax<unknown>;
      bindToFluentSyntaxMock = {
        to: jest.fn(),
      } as Partial<jest.Mocked<BindToFluentSyntax<unknown>>> as jest.Mocked<
        BindToFluentSyntax<unknown>
      >;
      serviceIdentifierFixture = Symbol.for('serviceIdentifier');
      targetFixture = class {};
      updateMetadataMapResultFixture = Symbol() as unknown as (
        bindingMetadataMap: BindingMetadataMap,
      ) => BindingMetadataMap;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        bindToFluentSyntaxMock.to.mockReturnValueOnce(
          bindInWhenOnFluentSyntaxFixture,
        );

        (
          updateMetadataMap as jest.Mock<typeof updateMetadataMap>
        ).mockReturnValueOnce(updateMetadataMapResultFixture);

        result = provide(serviceIdentifierFixture)(targetFixture);
      });

      it('should call updateMetadataMap()', () => {
        expect(updateMetadataMap).toHaveBeenCalledTimes(1);
        expect(updateMetadataMap).toHaveBeenCalledWith(targetFixture, {
          action: expect.any(Function),
          serviceIdentifier: serviceIdentifierFixture,
        });
      });

      it('should call updateOwnReflectMetadata()', () => {
        expect(updateOwnReflectMetadata).toHaveBeenCalledTimes(1);
        expect(updateOwnReflectMetadata).toHaveBeenCalledWith(
          Object,
          bindingMetadataMapReflectKey,
          buildDefaultBindingMetadataMap,
          updateMetadataMapResultFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
