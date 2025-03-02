import { BindingScope } from 'inversify';

export interface ControllerOptions {
  controllerName?: string;
  path?: string;
  scope?: BindingScope;
}
