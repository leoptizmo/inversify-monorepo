import { ClassElementMetadataKind } from '../models/ClassElementMetadataKind';
import { ManagedClassElementMetadata } from '../models/ManagedClassElementMetadata';

export class ManagedClassElementMetadataFixtures {
  public static get any(): ManagedClassElementMetadata {
    return {
      kind: ClassElementMetadataKind.singleInjection,
      name: undefined,
      optional: false,
      tags: new Map(),
      value: Symbol(),
    };
  }

  public static get withIsFromTypescriptParamTypeTrue(): ManagedClassElementMetadata {
    return {
      ...ManagedClassElementMetadataFixtures.any,
      isFromTypescriptParamType: true,
    };
  }

  public static get withNoIsFromTypescriptParamType(): ManagedClassElementMetadata {
    const fixture: ManagedClassElementMetadata =
      ManagedClassElementMetadataFixtures.any;

    delete fixture.isFromTypescriptParamType;

    return fixture;
  }
}
