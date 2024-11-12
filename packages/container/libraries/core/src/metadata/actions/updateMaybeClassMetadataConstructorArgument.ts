import { MaybeClassElementMetadata } from '../models/MaybeClassElementMetadata';
import { MaybeClassMetadata } from '../models/MaybeClassMetadata';

export function updateMaybeClassMetadataConstructorArgument(
  updateMetadata: (
    classMetadata: MaybeClassElementMetadata | undefined,
  ) => MaybeClassElementMetadata,
  index: number,
): (classMetadata: MaybeClassMetadata) => MaybeClassMetadata {
  return (classMetadata: MaybeClassMetadata): MaybeClassMetadata => {
    const propertyMetadata: MaybeClassElementMetadata | undefined =
      classMetadata.constructorArguments[index];

    classMetadata.constructorArguments[index] =
      updateMetadata(propertyMetadata);

    return classMetadata;
  };
}
