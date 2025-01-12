import { getOwnReflectMetadata } from './getOwnReflectMetadata';

export function updateOwnReflectMetadata<TMetadata>(
  target: object,
  metadataKey: unknown,
  buildDefaultValue: () => TMetadata,
  callback: (metadata: TMetadata) => TMetadata,
): void {
  const metadata: TMetadata =
    getOwnReflectMetadata(target, metadataKey) ?? buildDefaultValue();

  const updatedMetadata: TMetadata = callback(metadata);

  Reflect.defineMetadata(metadataKey, updatedMetadata, target);
}
