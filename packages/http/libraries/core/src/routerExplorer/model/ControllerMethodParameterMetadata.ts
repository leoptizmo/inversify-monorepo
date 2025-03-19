import { RequestMethodParameterType } from '../../http/models/RequestMethodParameterType';

export interface ControllerMethodParameterMetadata {
  index: number;
  parameterType: RequestMethodParameterType;
  parameterName?: string | undefined;
}
