import { BindToFluentSyntax, ServiceIdentifier } from 'inversify';

type BindAction<T> = (
  bind: (serviceIdentifier: ServiceIdentifier<T>) => BindToFluentSyntax<T>,
) => void;

export interface BindingMetadata<T> {
  action: BindAction<T>;
  serviceIdentifier: ServiceIdentifier<T>;
}
