import { CustomParameterDecoratorHandler } from '../../http/models/CustomParameterDecoratorHandler';
import { RequestMethodParameterType } from '../../http/models/RequestMethodParameterType';

export interface ControllerMethodParameterMetadata {
  customParameterDecoratorHandler?: CustomParameterDecoratorHandler | undefined;
  index: number;
  parameterType: RequestMethodParameterType;
  parameterName?: string | undefined;
}
