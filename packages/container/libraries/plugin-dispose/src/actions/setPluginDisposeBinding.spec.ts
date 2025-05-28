import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mocked,
  vitest,
} from 'vitest';

import {
  bindingScopeValues,
  bindingTypeValues,
} from '@gritcode/inversifyjs-core';

vitest.mock('./getPluginDisposeBindingMap');

import { BindingDisposeMetadata } from '../models/BindingDisposeMetadata';
import { SingletonScopedBinding } from '../models/SingletonScopedBinding';
import { getPluginDisposeBindingMap } from './getPluginDisposeBindingMap';
import { setPluginDisposeBinding } from './setPluginDisposeBinding';

describe(setPluginDisposeBinding, () => {
  let bindingFixture: SingletonScopedBinding;
  let bindingDisposeMetadataFixture: BindingDisposeMetadata;

  beforeAll(() => {
    bindingFixture = {
      cache: {
        isRight: false,
        value: undefined,
      },
      id: 0,
      isSatisfiedBy: () => true,
      moduleId: undefined,
      onActivation: undefined,
      onDeactivation: undefined,
      scope: bindingScopeValues.Singleton,
      serviceIdentifier: 'service-id',
      type: bindingTypeValues.ConstantValue,
      value: Symbol(),
    };
    bindingDisposeMetadataFixture = {
      dependendentBindings: new Set(),
    };
  });

  describe('when called', () => {
    let mapMock: Mocked<Map<SingletonScopedBinding, BindingDisposeMetadata>>;

    let result: unknown;

    beforeAll(() => {
      mapMock = {
        set: vitest.fn() as unknown,
      } as Partial<
        Mocked<Map<SingletonScopedBinding, BindingDisposeMetadata>>
      > as Mocked<Map<SingletonScopedBinding, BindingDisposeMetadata>>;

      vitest.mocked(getPluginDisposeBindingMap).mockReturnValueOnce(mapMock);

      result = setPluginDisposeBinding(
        bindingFixture,
        bindingDisposeMetadataFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call getPluginDisposeBindingMap()', () => {
      expect(getPluginDisposeBindingMap).toHaveBeenCalledTimes(1);
      expect(getPluginDisposeBindingMap).toHaveBeenCalledWith();
    });

    it('should call map.set()', () => {
      expect(mapMock.set).toHaveBeenCalledTimes(1);
      expect(mapMock.set).toHaveBeenCalledWith(
        bindingFixture,
        bindingDisposeMetadataFixture,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
