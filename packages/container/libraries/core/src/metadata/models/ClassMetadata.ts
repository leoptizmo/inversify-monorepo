import { ClassElementMetadata } from './ManagedClassElementMetadata';

export interface ClassMetadata {
  constructorArguments: ClassElementMetadata[];
  properties: Map<string | symbol, ClassElementMetadata>;
}
