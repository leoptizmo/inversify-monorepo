import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { BaseResolvedValueElementMetadata } from './BaseResolvedValueElementMetadata';
import { MetadataName } from './MetadataName';
import { MetadataTag } from './MetadataTag';
import { ResolvedValueElementMetadataKind } from './ResolvedValueElementMetadataKind';

export interface ResolvedValueElementMetadata
  extends BaseResolvedValueElementMetadata<ResolvedValueElementMetadataKind> {
  name: MetadataName | undefined;
  optional: boolean;
  tags: Map<MetadataTag, unknown>;
  value: ServiceIdentifier | LazyServiceIdentifier;
}
