import {
  getOwnReflectMetadata,
  setReflectMetadata,
  updateOwnReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

const ID_METADATA: string = '@inversifyjs/container/bindingId';

export function getContainerModuleId(): number {
  const bindingId: number =
    getOwnReflectMetadata<number>(Object, ID_METADATA) ?? 0;

  if (bindingId === Number.MAX_SAFE_INTEGER) {
    setReflectMetadata(Object, ID_METADATA, Number.MIN_SAFE_INTEGER);
  } else {
    updateOwnReflectMetadata(
      Object,
      ID_METADATA,
      () => bindingId,
      (id: number) => id + 1,
    );
  }

  return bindingId;
}
