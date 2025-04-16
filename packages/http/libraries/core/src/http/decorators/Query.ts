import { Newable } from 'inversify';

import { requestParamFactory } from '../calculations/requestParamFactory';
import { RequestMethodParameterType } from '../models/RequestMethodParameterType';
import { Pipe } from '../pipe/model/Pipe';

export function query(
  parameterNameOrPipe?: string | (Newable<Pipe> | Pipe),
  ...parameterPipeList: (Newable<Pipe> | Pipe)[]
): ParameterDecorator {
  return requestParamFactory(
    RequestMethodParameterType.QUERY,
    parameterPipeList,
    parameterNameOrPipe,
  );
}
