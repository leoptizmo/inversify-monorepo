import { afterAll, beforeAll, describe, expect, it, vitest } from 'vitest';

vitest.mock('./exploreControllerMethodParameterMetadataList');
vitest.mock('./exploreControllerMethodStatusCodeMetadata');
vitest.mock('./exploreControllerMethodGuardList');
vitest.mock('./exploreControllerMethodMiddlewareList');
vitest.mock('./buildMiddlewareOptionsFromApplyMiddlewareOptions');

import { Controller } from '../../http/models/Controller';
import { ControllerFunction } from '../../http/models/ControllerFunction';
import { RequestMethodType } from '../../http/models/RequestMethodType';
import { ControllerMethodMetadata } from '../model/ControllerMethodMetadata';
import { ControllerMethodParameterMetadata } from '../model/ControllerMethodParameterMetadata';
import { MiddlewareOptions } from '../model/MiddlewareOptions';
import { buildMiddlewareOptionsFromApplyMiddlewareOptions } from './buildMiddlewareOptionsFromApplyMiddlewareOptions';
import { buildRouterExplorerControllerMethodMetadata } from './buildRouterExplorerControllerMethodMetadata';
import { exploreControllerMethodGuardList } from './exploreControllerMethodGuardList';
import { exploreControllerMethodMiddlewareList } from './exploreControllerMethodMiddlewareList';
import { exploreControllerMethodParameterMetadataList } from './exploreControllerMethodParameterMetadataList';
import { exploreControllerMethodStatusCodeMetadata } from './exploreControllerMethodStatusCodeMetadata';

describe(buildRouterExplorerControllerMethodMetadata.name, () => {
  describe('when called', () => {
    let controllerMethodMetadataFixture: ControllerMethodMetadata;
    let controllerFixture: Controller;
    let controllerMethodParameterMetadataListFixture: ControllerMethodParameterMetadata[];
    let controllerMethodStatusCodeMetadataFixture: undefined;
    let controllerMethodGuardListFixture: NewableFunction[];
    let controllerMethodMiddlewareListFixture: NewableFunction[];
    let middlewareOptionsFixture: MiddlewareOptions;
    let result: unknown;

    beforeAll(() => {
      controllerMethodMetadataFixture = {
        methodKey: 'testMethod',
        path: '/test',
        requestMethodType: RequestMethodType.GET,
      };
      controllerFixture = {
        [controllerMethodMetadataFixture.methodKey]:
          (() => {}) as ControllerFunction,
      };
      controllerMethodParameterMetadataListFixture = [];
      controllerMethodStatusCodeMetadataFixture = undefined;
      controllerMethodGuardListFixture = [];
      controllerMethodMiddlewareListFixture = [];
      middlewareOptionsFixture = {
        postHandlerMiddlewareList: [],
        preHandlerMiddlewareList: [],
      };

      vitest
        .mocked(exploreControllerMethodParameterMetadataList)
        .mockReturnValue(controllerMethodParameterMetadataListFixture);

      vitest
        .mocked(exploreControllerMethodStatusCodeMetadata)
        .mockReturnValue(controllerMethodStatusCodeMetadataFixture);

      vitest
        .mocked(exploreControllerMethodGuardList)
        .mockReturnValue(controllerMethodGuardListFixture);

      vitest
        .mocked(exploreControllerMethodMiddlewareList)
        .mockReturnValue(controllerMethodMiddlewareListFixture);

      vitest
        .mocked(buildMiddlewareOptionsFromApplyMiddlewareOptions)
        .mockReturnValue(middlewareOptionsFixture);

      result = buildRouterExplorerControllerMethodMetadata(
        controllerFixture,
        controllerMethodMetadataFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call exploreControllerMethodParameterMetadataList', () => {
      expect(
        exploreControllerMethodParameterMetadataList,
      ).toHaveBeenCalledTimes(1);
      expect(exploreControllerMethodParameterMetadataList).toHaveBeenCalledWith(
        controllerFixture[controllerMethodMetadataFixture.methodKey],
      );
    });

    it('should call exploreControllerMethodStatusCodeMetadata', () => {
      expect(exploreControllerMethodStatusCodeMetadata).toHaveBeenCalledTimes(
        1,
      );
      expect(exploreControllerMethodStatusCodeMetadata).toHaveBeenCalledWith(
        controllerFixture[controllerMethodMetadataFixture.methodKey],
      );
    });

    it('should call exploreControllerMethodGuardList', () => {
      expect(exploreControllerMethodGuardList).toHaveBeenCalledTimes(1);
      expect(exploreControllerMethodGuardList).toHaveBeenCalledWith(
        controllerFixture[controllerMethodMetadataFixture.methodKey],
      );
    });

    it('should call exploreControllerMethodMiddlewareList', () => {
      expect(exploreControllerMethodMiddlewareList).toHaveBeenCalledTimes(1);
      expect(exploreControllerMethodMiddlewareList).toHaveBeenCalledWith(
        controllerFixture[controllerMethodMetadataFixture.methodKey],
      );
    });

    it('should call buildMiddlewareOptionsFromApplyMiddlewareOptions', () => {
      expect(
        buildMiddlewareOptionsFromApplyMiddlewareOptions,
      ).toHaveBeenCalledTimes(1);
      expect(
        buildMiddlewareOptionsFromApplyMiddlewareOptions,
      ).toHaveBeenCalledWith(controllerMethodMiddlewareListFixture);
    });

    it('should return a RouterExplorerControllerMethodMetadata', () => {
      expect(result).toStrictEqual({
        guardList: controllerMethodGuardListFixture,
        methodKey: controllerMethodMetadataFixture.methodKey,
        parameterMetadataList: controllerMethodParameterMetadataListFixture,
        path: controllerMethodMetadataFixture.path,
        postHandlerMiddlewareList:
          middlewareOptionsFixture.postHandlerMiddlewareList,
        preHandlerMiddlewareList:
          middlewareOptionsFixture.preHandlerMiddlewareList,
        requestMethodType: controllerMethodMetadataFixture.requestMethodType,
        statusCode: controllerMethodStatusCodeMetadataFixture,
      });
    });
  });
});
