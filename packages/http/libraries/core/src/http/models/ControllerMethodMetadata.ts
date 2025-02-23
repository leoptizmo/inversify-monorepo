import { RequestMethodType } from './RequestMethodType';

export interface ControllerMethodMetadata {
  path: string;
  requestMethodType: RequestMethodType;
  methodKey: string | symbol;
}
