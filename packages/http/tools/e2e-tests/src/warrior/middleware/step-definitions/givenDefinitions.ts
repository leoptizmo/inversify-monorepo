import { Given } from '@cucumber/cucumber';
import { Container } from 'inversify';

import { defaultAlias } from '../../../common/models/defaultAlias';
import { InversifyHttpWorld } from '../../../common/models/InversifyHttpWorld';
import { getContainerOrFail } from '../../../container/calculations/getContainerOrFail';
import { HttpMethod } from '../../../http/models/HttpMethod';
import { WarriorsDeleteSuccessfulMiddlewareController } from '../controllers/WarriorsDeleteSuccessfulMiddlewareController';
import { WarriorsDeleteUnsuccessfulMiddlewareController } from '../controllers/WarriorsDeleteUnsuccessfulMiddlewareController';
import { WarriorsGetSuccessfulMiddlewareController } from '../controllers/WarriorsGetSuccessfulMiddlewareController';
import { WarriorsGetUnsuccessfulMiddlewareController } from '../controllers/WarriorsGetUnsuccessfulMiddlewareController';
import { WarriorsOptionsSuccessfulMiddlewareController } from '../controllers/WarriorsOptionsSuccessfulMiddlewareController';
import { WarriorsOptionsUnsuccessfulMiddlewareController } from '../controllers/WarriorsOptionsUnsuccessfulMiddlewareController';
import { WarriorsPatchSuccessfulMiddlewareController } from '../controllers/WarriorsPatchSuccessfulMiddlewareController';
import { WarriorsPatchUnsuccessfulMiddlewareController } from '../controllers/WarriorsPatchUnsuccessfulMiddlewareController';
import { WarriorsPostSuccessfulMiddlewareController } from '../controllers/WarriorsPostSuccessfulMiddlewareController';
import { WarriorsPostUnsuccessfulMiddlewareController } from '../controllers/WarriorsPostUnsuccessfulMiddlewareController';
import { WarriorsPutSuccessfulMiddlewareController } from '../controllers/WarriorsPutSuccessfulMiddlewareController';
import { WarriorsPutUnsuccessfulMiddlewareController } from '../controllers/WarriorsPutUnsuccessfulMiddlewareController';
import { SuccessfulMiddleware } from '../middlewares/SuccessfulMiddleware';
import { UnsuccessfulMiddleware } from '../middlewares/UnsuccessfulMiddleware';

function getMethodWarriorSuccessfulMiddlewareController(
  method: HttpMethod,
): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteSuccessfulMiddlewareController;
    case HttpMethod.get:
      return WarriorsGetSuccessfulMiddlewareController;
    case HttpMethod.options:
      return WarriorsOptionsSuccessfulMiddlewareController;
    case HttpMethod.patch:
      return WarriorsPatchSuccessfulMiddlewareController;
    case HttpMethod.post:
      return WarriorsPostSuccessfulMiddlewareController;
    case HttpMethod.put:
      return WarriorsPutSuccessfulMiddlewareController;
  }
}

function getMethodWarriorUnsuccessfulMiddlewareController(
  method: HttpMethod,
): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteUnsuccessfulMiddlewareController;
    case HttpMethod.get:
      return WarriorsGetUnsuccessfulMiddlewareController;
    case HttpMethod.options:
      return WarriorsOptionsUnsuccessfulMiddlewareController;
    case HttpMethod.patch:
      return WarriorsPatchUnsuccessfulMiddlewareController;
    case HttpMethod.post:
      return WarriorsPostUnsuccessfulMiddlewareController;
    case HttpMethod.put:
      return WarriorsPutUnsuccessfulMiddlewareController;
  }
}

function givenWarriorSuccessfulMiddlewareControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction =
    getMethodWarriorSuccessfulMiddlewareController(method);

  container.bind(SuccessfulMiddleware).toSelf().inSingletonScope();
  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorUnsuccessfulMiddlewareControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction =
    getMethodWarriorUnsuccessfulMiddlewareController(method);

  container.bind(UnsuccessfulMiddleware).toSelf().inSingletonScope();
  container.bind(controller).toSelf().inSingletonScope();
}

Given<InversifyHttpWorld>(
  'a warrior controller with SuccessfulMiddleware for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorSuccessfulMiddlewareControllerForContainer.bind(this)(
      httpMethod,
    );
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with UnsuccessfulMiddleware for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorUnsuccessfulMiddlewareControllerForContainer.bind(this)(
      httpMethod,
    );
  },
);
