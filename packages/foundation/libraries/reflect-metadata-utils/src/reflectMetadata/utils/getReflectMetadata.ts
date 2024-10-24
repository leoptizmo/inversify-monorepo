// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function getReflectMetadata<TMetadata>(
  target: object,
  metadataKey: unknown,
): TMetadata | undefined {
  return Reflect.getMetadata(metadataKey, target) as TMetadata | undefined;
}
