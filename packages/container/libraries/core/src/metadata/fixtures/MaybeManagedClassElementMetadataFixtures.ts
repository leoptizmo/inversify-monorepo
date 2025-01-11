import { MaybeClassElementMetadataKind } from '../models/MaybeClassElementMetadataKind';
import { MaybeManagedClassElementMetadata } from '../models/MaybeManagedClassElementMetadata';

export class MaybeManagedClassElementMetadataFixtures {
  public static get any(): MaybeManagedClassElementMetadata {
    return {
      kind: MaybeClassElementMetadataKind.unknown,
      name: undefined,
      optional: false,
      tags: new Map(),
    };
  }
}
