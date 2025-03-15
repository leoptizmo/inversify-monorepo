import { RequestMethodParameterType } from './RequestMethodParameterType';

export interface ControllerMethodParameterMetadata {
  index: number;
  parameterType: RequestMethodParameterType;
  parameterName?: string | undefined;
}
