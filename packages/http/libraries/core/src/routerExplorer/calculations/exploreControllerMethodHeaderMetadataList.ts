import { getReflectMetadata } from '@inversifyjs/reflect-metadata-utils';

import { ControllerFunction } from '../../http/models/ControllerFunction';
import { controllerMethodHeaderMetadataReflectKey } from '../../reflectMetadata/data/controllerMethodHeaderMetadataReflectKey';

export function exploreControllerMethodHeaderMetadataList(
  controllerMethod: ControllerFunction,
): [string, string][] {
  const headerMetadata: Map<string, string> | undefined = getReflectMetadata(
    controllerMethod,
    controllerMethodHeaderMetadataReflectKey,
  );

  const headerMetadataList: [string, string][] = [];

  if (headerMetadata !== undefined) {
    headerMetadataList.push(...headerMetadata.entries());
  }

  return headerMetadataList;
}
