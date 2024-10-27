import { ClassElementMetadataKind } from './ClassElementMetadataKind';

export interface BaseClassElementMetadata<
  TKind extends ClassElementMetadataKind,
> {
  kind: TKind;
}
