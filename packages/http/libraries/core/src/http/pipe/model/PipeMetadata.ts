import { RequestMethodParameterType } from '../../models/RequestMethodParameterType';

export interface PipeMetadata {
  targetClass: object;
  methodName: string | symbol;
  parameterIndex: number;
  parameterMethodType: RequestMethodParameterType;
}
