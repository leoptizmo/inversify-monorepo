export function setReflectMetadata(
  target: object,
  metadataKey: unknown,
  metadata: unknown,
): void {
  Reflect.defineMetadata(metadataKey, metadata, target);
}
