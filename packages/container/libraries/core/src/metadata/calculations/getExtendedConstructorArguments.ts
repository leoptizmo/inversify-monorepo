import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassMetadata } from '../models/ClassMetadata';
import { InjectFromOptions } from '../models/InjectFromOptions';

export function getExtendedConstructorArguments(
  options: InjectFromOptions,
  baseTypeClassMetadata: ClassMetadata,
  typeMetadata: ClassMetadata,
): ClassElementMetadata[] {
  const extendConstructorArguments: boolean =
    options.extendConstructorArguments ?? true;

  let extendedConstructorArguments: ClassElementMetadata[];

  if (extendConstructorArguments) {
    extendedConstructorArguments = [
      ...baseTypeClassMetadata.constructorArguments,
    ];

    typeMetadata.constructorArguments.map(
      (classElementMetadata: ClassElementMetadata, index: number) => {
        extendedConstructorArguments[index] = classElementMetadata;
      },
    );
  } else {
    extendedConstructorArguments = typeMetadata.constructorArguments;
  }

  return extendedConstructorArguments;
}
