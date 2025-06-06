import { MethodDecoratorInfo } from './MethodDecoratorInfo';
import { ParameterDecoratorInfo } from './ParameterDecoratorInfo';
import { PropertyDecoratorInfo } from './PropertyDecoratorInfo';

export type DecoratorInfo =
  | MethodDecoratorInfo
  | ParameterDecoratorInfo
  | PropertyDecoratorInfo;
