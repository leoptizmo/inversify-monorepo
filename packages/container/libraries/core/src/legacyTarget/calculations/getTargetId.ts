import {
  getReflectMetadata,
  updateReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

const ID_METADATA: string = '@inversifyjs/core/targetId';

export function getTargetId(): number {
  const targetId: number = getReflectMetadata<number>(Object, ID_METADATA) ?? 0;

  if (targetId === Number.MAX_SAFE_INTEGER) {
    updateReflectMetadata(
      Object,
      ID_METADATA,
      targetId,
      () => Number.MIN_SAFE_INTEGER,
    );
  } else {
    updateReflectMetadata(
      Object,
      ID_METADATA,
      targetId,
      (id: number) => id + 1,
    );
  }

  return targetId;
}
