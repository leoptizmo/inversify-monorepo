import {
  getReflectMetadata,
  setReflectMetadata,
} from '@inversifyjs/reflect-metadata-utils';

import { controllerMethodHeaderMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodHeaderMetadataReflectKey';
import { ControllerFunction } from '../models/ControllerFunction';

export function setHeader(key: string, value: string): MethodDecorator {
  return (
    _target: object,
    _key: string | symbol,
    descriptor: PropertyDescriptor,
  ): void => {
    const headerMetadata: Map<string, string> =
      getReflectMetadata(
        descriptor.value as ControllerFunction,
        controllerMethodHeaderMetadataReflectKey,
      ) ?? new Map<string, string>();

    const fixedKey: string = key.toLowerCase();

    const headerValue: string | undefined = headerMetadata.get(fixedKey);

    if (headerValue !== undefined) {
      headerMetadata.set(fixedKey, `${headerValue}, ${value}`);
    } else {
      headerMetadata.set(fixedKey, value);
    }

    setReflectMetadata(
      descriptor.value as ControllerFunction,
      controllerMethodHeaderMetadataReflectKey,
      headerMetadata,
    );
  };
}
