import { Given } from '@cucumber/cucumber';
import { Container } from 'inversify';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyHttpWorld } from '../../common/models/InversifyHttpWorld';
import { getContainerOrFail } from '../../container/calculations/getContainerOrFail';
import { HttpMethod } from '../../http/models/HttpMethod';
import { setServerRequest } from '../../server/actions/setServerRequest';
import { getServerOrFail } from '../../server/calculations/getServerOrFail';
import { Server } from '../../server/models/Server';
import { WarriorsDeleteBodyController } from '../controllers/WarriorsDeleteBodyController';
import { WarriorsDeleteBodyNamedController } from '../controllers/WarriorsDeleteBodyNamedController';
import { WarriorsDeleteController } from '../controllers/WarriorsDeleteController';
import { WarriorsDeleteHeadersController } from '../controllers/WarriorsDeleteHeadersController';
import { WarriorsDeleteHeadersNamedController } from '../controllers/WarriorsDeleteHeadersNamedController';
import { WarriorsDeleteParamsController } from '../controllers/WarriorsDeleteParamsController';
import { WarriorsDeleteParamsNamedController } from '../controllers/WarriorsDeleteParamsNamedController';
import { WarriorsDeleteQueryController } from '../controllers/WarriorsDeleteQueryController';
import { WarriorsDeleteQueryNamedController } from '../controllers/WarriorsDeleteQueryNamedController';
import { WarriorsGetController } from '../controllers/WarriorsGetController';
import { WarriorsGetHeadersController } from '../controllers/WarriorsGetHeadersController';
import { WarriorsGetHeadersNamedController } from '../controllers/WarriorsGetHeadersNamedController';
import { WarriorsGetParamsController } from '../controllers/WarriorsGetParamsController';
import { WarriorsGetParamsNamedController } from '../controllers/WarriorsGetParamsNamedController';
import { WarriorsGetQueryController } from '../controllers/WarriorsGetQueryController';
import { WarriorsGetQueryNamedController } from '../controllers/WarriorsGetQueryNamedController';
import { WarriorsOptionsBodyController } from '../controllers/WarriorsOptionsBodyController';
import { WarriorsOptionsBodyNamedController } from '../controllers/WarriorsOptionsBodyNamedController';
import { WarriorsOptionsController } from '../controllers/WarriorsOptionsController';
import { WarriorsOptionsHeadersController } from '../controllers/WarriorsOptionsHeadersController';
import { WarriorsOptionsHeadersNamedController } from '../controllers/WarriorsOptionsHeadersNamedController';
import { WarriorsOptionsQueryController } from '../controllers/WarriorsOptionsQueryController';
import { WarriorsOptionsQueryNamedController } from '../controllers/WarriorsOptionsQueryNamedController';
import { WarriorsPatchBodyController } from '../controllers/WarriorsPatchBodyController';
import { WarriorsPatchBodyNamedController } from '../controllers/WarriorsPatchBodyNamedController';
import { WarriorsPatchController } from '../controllers/WarriorsPatchController';
import { WarriorsPatchHeadersController } from '../controllers/WarriorsPatchHeadersController';
import { WarriorsPatchHeadersNamedController } from '../controllers/WarriorsPatchHeadersNamedController';
import { WarriorsPatchParamsController } from '../controllers/WarriorsPatchParamsController';
import { WarriorsPatchParamsNamedController } from '../controllers/WarriorsPatchParamsNamedController';
import { WarriorsPatchQueryController } from '../controllers/WarriorsPatchQueryController';
import { WarriorsPatchQueryNamedController } from '../controllers/WarriorsPatchQueryNamedController';
import { WarriorsPostBodyController } from '../controllers/WarriorsPostBodyController';
import { WarriorsPostBodyNamedController } from '../controllers/WarriorsPostBodyNamedController';
import { WarriorsPostController } from '../controllers/WarriorsPostController';
import { WarriorsPostHeadersController } from '../controllers/WarriorsPostHeadersController';
import { WarriorsPostHeadersNamedController } from '../controllers/WarriorsPostHeadersNamedController';
import { WarriorsPostParamsController } from '../controllers/WarriorsPostParamsController';
import { WarriorsPostParamsNamedController } from '../controllers/WarriorsPostParamsNamedController';
import { WarriorsPostQueryController } from '../controllers/WarriorsPostQueryController';
import { WarriorsPostQueryNamedController } from '../controllers/WarriorsPostQueryNamedController';
import { WarriorsPutBodyController } from '../controllers/WarriorsPutBodyController';
import { WarriorsPutBodyNamedController } from '../controllers/WarriorsPutBodyNamedController';
import { WarriorsPutController } from '../controllers/WarriorsPutController';
import { WarriorsPutHeadersController } from '../controllers/WarriorsPutHeadersController';
import { WarriorsPutHeadersNamedController } from '../controllers/WarriorsPutHeadersNamedController';
import { WarriorsPutParamsController } from '../controllers/WarriorsPutParamsController';
import { WarriorsPutParamsNamedController } from '../controllers/WarriorsPutParamsNamedController';
import { WarriorsPutQueryController } from '../controllers/WarriorsPutQueryController';
import { WarriorsPutQueryNamedController } from '../controllers/WarriorsPutQueryNamedController';
import { WarriorCreationResponseType } from '../models/WarriorCreationResponseType';
import { WarriorRequest } from '../models/WarriorRequest';

function getMethodWarriorController(method: HttpMethod): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteController;
    case HttpMethod.get:
      return WarriorsGetController;
    case HttpMethod.options:
      return WarriorsOptionsController;
    case HttpMethod.patch:
      return WarriorsPatchController;
    case HttpMethod.post:
      return WarriorsPostController;
    case HttpMethod.put:
      return WarriorsPutController;
  }
}

function getMethodWarriorParamsController(method: HttpMethod): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteParamsController;
    case HttpMethod.get:
      return WarriorsGetParamsController;
    case HttpMethod.options:
      throw new Error('Options not supported for params controller');
    case HttpMethod.patch:
      return WarriorsPatchParamsController;
    case HttpMethod.post:
      return WarriorsPostParamsController;
    case HttpMethod.put:
      return WarriorsPutParamsController;
  }
}

function getMethodWarriorParamsNamedController(
  method: HttpMethod,
): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteParamsNamedController;
    case HttpMethod.get:
      return WarriorsGetParamsNamedController;
    case HttpMethod.options:
      throw new Error('Options not supported for params named controller');
    case HttpMethod.patch:
      return WarriorsPatchParamsNamedController;
    case HttpMethod.post:
      return WarriorsPostParamsNamedController;
    case HttpMethod.put:
      return WarriorsPutParamsNamedController;
  }
}

function getMethodWarriorQueryController(method: HttpMethod): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteQueryController;
    case HttpMethod.get:
      return WarriorsGetQueryController;
    case HttpMethod.options:
      return WarriorsOptionsQueryController;
    case HttpMethod.patch:
      return WarriorsPatchQueryController;
    case HttpMethod.post:
      return WarriorsPostQueryController;
    case HttpMethod.put:
      return WarriorsPutQueryController;
  }
}

function getMethodWarriorQueryNamedController(
  method: HttpMethod,
): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteQueryNamedController;
    case HttpMethod.get:
      return WarriorsGetQueryNamedController;
    case HttpMethod.options:
      return WarriorsOptionsQueryNamedController;
    case HttpMethod.patch:
      return WarriorsPatchQueryNamedController;
    case HttpMethod.post:
      return WarriorsPostQueryNamedController;
    case HttpMethod.put:
      return WarriorsPutQueryNamedController;
  }
}

function getMethodWarriorHeadersController(
  method: HttpMethod,
): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteHeadersController;
    case HttpMethod.get:
      return WarriorsGetHeadersController;
    case HttpMethod.options:
      return WarriorsOptionsHeadersController;
    case HttpMethod.patch:
      return WarriorsPatchHeadersController;
    case HttpMethod.post:
      return WarriorsPostHeadersController;
    case HttpMethod.put:
      return WarriorsPutHeadersController;
  }
}

function getMethodWarriorHeadersNamedController(
  method: HttpMethod,
): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteHeadersNamedController;
    case HttpMethod.get:
      return WarriorsGetHeadersNamedController;
    case HttpMethod.options:
      return WarriorsOptionsHeadersNamedController;
    case HttpMethod.patch:
      return WarriorsPatchHeadersNamedController;
    case HttpMethod.post:
      return WarriorsPostHeadersNamedController;
    case HttpMethod.put:
      return WarriorsPutHeadersNamedController;
  }
}

function getMethodWarriorBodyController(method: HttpMethod): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteBodyController;
    case HttpMethod.get:
      throw new Error('Get not supported for body controller');
    case HttpMethod.options:
      return WarriorsOptionsBodyController;
    case HttpMethod.patch:
      return WarriorsPatchBodyController;
    case HttpMethod.post:
      return WarriorsPostBodyController;
    case HttpMethod.put:
      return WarriorsPutBodyController;
  }
}

function getMethodWarriorBodyNamedController(
  method: HttpMethod,
): NewableFunction {
  switch (method) {
    case HttpMethod.delete:
      return WarriorsDeleteBodyNamedController;
    case HttpMethod.get:
      throw new Error('Get not supported for body named controller');
    case HttpMethod.options:
      return WarriorsOptionsBodyNamedController;
    case HttpMethod.patch:
      return WarriorsPatchBodyNamedController;
    case HttpMethod.post:
      return WarriorsPostBodyNamedController;
    case HttpMethod.put:
      return WarriorsPutBodyNamedController;
  }
}

function givenWarriorRequestForServer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  serverAlias?: string,
): void {
  const parsedServerAlias: string = serverAlias ?? defaultAlias;
  const server: Server = getServerOrFail.bind(this)(parsedServerAlias);

  const url: string = `http://${server.host}:${server.port.toString()}/warriors`;

  const requestInit: RequestInit = {
    method,
  };

  const request: Request = new Request(url, requestInit);
  setServerRequest.bind(this)(parsedServerAlias, request);
}

function givenWarriorRequestWithParamsForServer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  serverAlias?: string,
): void {
  const parsedServerAlias: string = serverAlias ?? defaultAlias;
  const server: Server = getServerOrFail.bind(this)(parsedServerAlias);

  const url: string = `http://${server.host}:${server.port.toString()}/warriors/123`;

  const requestInit: RequestInit = {
    method,
  };

  const request: Request = new Request(url, requestInit);
  setServerRequest.bind(this)(parsedServerAlias, request);
}

function givenWarriorRequestWithBodyForServer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  serverAlias?: string,
): void {
  const parsedServerAlias: string = serverAlias ?? defaultAlias;
  const server: Server = getServerOrFail.bind(this)(parsedServerAlias);

  const url: string = `http://${server.host}:${server.port.toString()}/warriors`;

  const warriorRequest: WarriorRequest = {
    name: 'Samurai',
    type: WarriorCreationResponseType.Melee,
  };

  const requestInit: RequestInit = {
    body: JSON.stringify(warriorRequest),
    headers: {
      'Content-Type': 'application/json',
    },
    method,
  };

  const request: Request = new Request(url, requestInit);
  setServerRequest.bind(this)(parsedServerAlias, request);
}

function givenWarriorRequestWithQueryForServer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  serverAlias?: string,
): void {
  const parsedServerAlias: string = serverAlias ?? defaultAlias;

  const server: Server = getServerOrFail.bind(this)(parsedServerAlias);

  const url: string = `http://${server.host}:${server.port.toString()}/warriors?filter=test`;

  const requestInit: RequestInit = {
    method,
  };

  const request: Request = new Request(url, requestInit);
  setServerRequest.bind(this)(parsedServerAlias, request);
}

function givenWarriorRequestWithHeadersForServer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  serverAlias?: string,
): void {
  const parsedServerAlias: string = serverAlias ?? defaultAlias;

  const server: Server = getServerOrFail.bind(this)(parsedServerAlias);

  const url: string = `http://${server.host}:${server.port.toString()}/warriors`;

  const requestInit: RequestInit = {
    headers: {
      'x-test-header': 'test-value',
    },
    method,
  };

  const request: Request = new Request(url, requestInit);

  setServerRequest.bind(this)(parsedServerAlias, request);
}

function givenWarriorControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction = getMethodWarriorController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorParamsControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction = getMethodWarriorParamsController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorParamsNamedControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction =
    getMethodWarriorParamsNamedController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorQueryControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;

  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction = getMethodWarriorQueryController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorQueryNamedControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;

  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction =
    getMethodWarriorQueryNamedController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorHeadersControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;

  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction = getMethodWarriorHeadersController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorHeadersNamedControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;

  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction =
    getMethodWarriorHeadersNamedController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorBodyControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction = getMethodWarriorBodyController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

function givenWarriorBodyNamedControllerForContainer(
  this: InversifyHttpWorld,
  method: HttpMethod,
  containerAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const container: Container =
    getContainerOrFail.bind(this)(parsedContainerAlias);

  const controller: NewableFunction =
    getMethodWarriorBodyNamedController(method);

  container.bind(controller).toSelf().inSingletonScope();
}

Given<InversifyHttpWorld>(
  'a "{httpMethod}" warrior controller for container',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with params decorator without parameter name for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorParamsControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with params decorator with parameter name for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorParamsNamedControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with query decorator without parameter name for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorQueryControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with query decorator with parameter name for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorQueryNamedControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with headers decorator without parameter name for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorHeadersControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with headers decorator with parameter name for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorHeadersNamedControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with body decorator without parameter name for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorBodyControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a warrior controller with body decorator with parameter name for "{httpMethod}" method',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorBodyNamedControllerForContainer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a "{httpMethod}" warriors HTTP request',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorRequestForServer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a "{httpMethod}" warriors HTTP request with parameters',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorRequestWithParamsForServer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a "{httpMethod}" warriors HTTP request with query parameters',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorRequestWithQueryForServer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a "{httpMethod}" warriors HTTP request with headers',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorRequestWithHeadersForServer.bind(this)(httpMethod);
  },
);

Given<InversifyHttpWorld>(
  'a "{httpMethod}" warriors HTTP request with body',
  function (this: InversifyHttpWorld, httpMethod: HttpMethod): void {
    givenWarriorRequestWithBodyForServer.bind(this)(httpMethod);
  },
);
