import { chain } from '../../common/calculations/chain';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassMetadata } from '../models/ClassMetadata';
import { InjectFromOptions } from '../models/InjectFromOptions';

export function getExtendedProperties(
  options: InjectFromOptions,
  baseTypeClassMetadata: ClassMetadata,
  typeMetadata: ClassMetadata,
): Map<string | symbol, ClassElementMetadata> {
  const extendProperties: boolean = options.extendProperties ?? true;

  let extendedProperties: Map<string | symbol, ClassElementMetadata>;

  if (extendProperties) {
    extendedProperties = new Map(
      chain(baseTypeClassMetadata.properties, typeMetadata.properties),
    );
  } else {
    extendedProperties = typeMetadata.properties;
  }

  return extendedProperties;
}
