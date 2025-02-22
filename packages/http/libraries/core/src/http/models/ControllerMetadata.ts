export interface ControllerMetadata {
  path: string;
  controllerName?: string | undefined;
  target: NewableFunction;
}
