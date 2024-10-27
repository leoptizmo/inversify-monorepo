import { ServiceIdentifier } from '@inversifyjs/common';

import {
  INJECT_TAG,
  MULTI_INJECT_TAG,
  NAME_TAG,
  NAMED_TAG,
  NON_CUSTOM_TAG_KEYS,
  OPTIONAL_TAG,
  UNMANAGED_TAG,
} from '../../reflectMetadata/data/keys';
import { ClassElementMetadata } from '../models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { LegacyMetadata } from '../models/LegacyMetadata';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';
import { MetadataName } from '../models/MetadataName';
import { MetadataTag } from '../models/MetadataTag';
import { MetadataTargetName } from '../models/MetadataTargetName';

export function getClassElementMetadataFromLegacyMetadata(
  metadataList: LegacyMetadata[],
): ClassElementMetadata {
  const injectMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === INJECT_TAG,
  );
  const multiInjectMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === MULTI_INJECT_TAG,
  );
  const unmanagedMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === UNMANAGED_TAG,
  );

  if (unmanagedMetadata !== undefined) {
    return {
      kind: ClassElementMetadataKind.unmanaged,
    };
  }

  if (multiInjectMetadata === undefined && injectMetadata === undefined) {
    throw new Error();
  }

  const nameMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === NAME_TAG,
  );

  const optionalMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === OPTIONAL_TAG,
  );

  const targetNameMetadata: LegacyMetadata | undefined = metadataList.find(
    (metadata: LegacyMetadata): boolean => metadata.key === NAMED_TAG,
  );

  const managedClassElementMetadata: ManagedClassElementMetadata = {
    kind:
      injectMetadata === undefined
        ? ClassElementMetadataKind.multipleInjection
        : ClassElementMetadataKind.singleInjection,
    name: nameMetadata?.value as MetadataName | undefined,
    optional: optionalMetadata !== undefined,
    tags: new Map(
      metadataList
        .filter((metadata: LegacyMetadata): boolean =>
          NON_CUSTOM_TAG_KEYS.every(
            (customTagKey: string): boolean => metadata.key !== customTagKey,
          ),
        )
        .map((metadata: LegacyMetadata): [MetadataTag, unknown] => [
          metadata.key,
          metadata.value,
        ]),
    ),
    targetName: targetNameMetadata?.value as MetadataTargetName | undefined,
    value:
      injectMetadata === undefined
        ? (multiInjectMetadata?.value as ServiceIdentifier)
        : (injectMetadata.value as ServiceIdentifier),
  };

  return managedClassElementMetadata;
}
