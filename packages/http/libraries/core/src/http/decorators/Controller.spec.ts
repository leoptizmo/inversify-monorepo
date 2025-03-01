import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@inversifyjs/reflect-metadata-utils');
jest.mock('inversify');

import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';
import { BindingScope, injectable } from 'inversify';

import { controllerMetadataReflectKey } from '../../reflectMetadata/data/controllerMetadataReflectKey';
import { controller } from './Controller';

describe(controller.name, () => {
  describe('having a scope defined', () => {
    describe('when called', () => {
      let pathFixture: string;
      let targetFixture: NewableFunction;
      let scopeFixture: BindingScope;
      let classDecoratorMock: jest.Mock<ClassDecorator>;

      beforeAll(() => {
        pathFixture = '/api';
        targetFixture = class TestController {};
        scopeFixture = {} as BindingScope;
        classDecoratorMock = jest.fn();

        (injectable as jest.Mocked<typeof injectable>).mockReturnValue(
          classDecoratorMock as ClassDecorator,
        );

        controller(pathFixture, scopeFixture)(targetFixture);
      });

      it('should call injectable', () => {
        expect(injectable).toHaveBeenCalledWith(scopeFixture);
      });

      it('should call ClassDecorator', () => {
        expect(classDecoratorMock).toHaveBeenCalledWith(targetFixture);
      });
    });
  });

  describe('having a undefined scope', () => {
    describe('when called with a string path', () => {
      let pathFixture: string;
      let targetFixture: NewableFunction;

      beforeAll(() => {
        pathFixture = '/api';
        targetFixture = class TestController {};

        controller(pathFixture)(targetFixture);
      });

      it('should get existing metadata', () => {
        expect(getReflectMetadata).toHaveBeenCalledWith(
          Reflect,
          controllerMetadataReflectKey,
        );
      });

      it('should set metadata with controller path', () => {
        expect(setReflectMetadata).toHaveBeenCalledWith(
          Reflect,
          controllerMetadataReflectKey,
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
      let targetFixture: NewableFunction;

      beforeAll(() => {
        optionsFixture = {
          controllerName: 'TestController',
          path: '/api',
        };
        targetFixture = class TestController {};

        controller(optionsFixture)(targetFixture);
      });

      it('should set metadata with controller options', () => {
        expect(setReflectMetadata).toHaveBeenCalledWith(
          Reflect,
          controllerMetadataReflectKey,
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
});
