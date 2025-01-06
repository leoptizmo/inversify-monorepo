import { When } from '@cucumber/cucumber';

import { defaultAlias } from '../../common/models/defaultAlias';
import { InversifyWorld } from '../../common/models/InversifyWorld';
import { setContainerGetRequest } from '../actions/setContainerGetRequest';
import { getContainerOrFail } from '../calculations/getContainerOrFail';

function whenContainerGetsValueForService(
  this: InversifyWorld,
  serviceId: string,
  containerAlias?: string,
  valueAlias?: string,
): void {
  const parsedContainerAlias: string = containerAlias ?? defaultAlias;
  const parsedValueAlias: string = valueAlias ?? defaultAlias;

  setContainerGetRequest.bind(this)(
    parsedValueAlias,
    getContainerOrFail.bind(this)(parsedContainerAlias).get(serviceId),
  );
}

When<InversifyWorld>(
  'container gets a {string} value for service {string}',
  function (valueAlias: string, serviceId: string): void {
    whenContainerGetsValueForService.bind(this)(
      serviceId,
      undefined,
      valueAlias,
    );
  },
);
