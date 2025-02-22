import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');

import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { METADATA_KEY } from '../models/MetadataKey';
import { controller } from './Controller';

describe(controller.name, () => {
  describe('when called with a string path', () => {
    let pathFixture: string;
    let decoratorFixture: ClassDecorator;
    let targetFixture: NewableFunction;

    beforeAll(() => {
      pathFixture = '/api';
      targetFixture = class TestController {};
      decoratorFixture = controller(pathFixture);

      decoratorFixture(targetFixture);
    });

    it('should get existing metadata', () => {
      expect(getReflectMetadata).toHaveBeenCalledWith(
        Reflect,
        METADATA_KEY.controller,
      );
    });

    it('should set metadata with controller path', () => {
      expect(setReflectMetadata).toHaveBeenCalledWith(
        Reflect,
        METADATA_KEY.controller,
        [
          {
            path: pathFixture,
            target: targetFixture,
          },
        ],
      );
    });
  });

  describe('when called with options object', () => {
    let optionsFixture: { controllerName: string; path: string };
    let decoratorFixture: ClassDecorator;
    let targetFixture: NewableFunction;

    beforeAll(() => {
      optionsFixture = {
        controllerName: 'TestController',
        path: '/api',
      };
      targetFixture = class TestController {};
      decoratorFixture = controller(optionsFixture);

      decoratorFixture(targetFixture);
    });

    it('should set metadata with controller options', () => {
      expect(setReflectMetadata).toHaveBeenCalledWith(
        Reflect,
        METADATA_KEY.controller,
        [
          {
            controllerName: optionsFixture.controllerName,
            path: optionsFixture.path,
            target: targetFixture,
          },
        ],
      );
    });
  });
});
