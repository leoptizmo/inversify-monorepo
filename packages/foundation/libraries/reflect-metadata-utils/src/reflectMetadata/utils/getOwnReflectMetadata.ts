// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function getOwnReflectMetadata<TMetadata>(
  target: object,
  metadataKey: unknown,
): TMetadata | undefined {
  return Reflect.getOwnMetadata(metadataKey, target) as TMetadata | undefined;
}
