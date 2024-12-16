import { MaybeClassMetadata } from '../models/MaybeClassMetadata';

export class MaybeClassMetadataFixtures {
  public static get any(): MaybeClassMetadata {
    const fixture: MaybeClassMetadata = {
      constructorArguments: [],
      lifecycle: {
        postConstructMethodName: undefined,
        preDestroyMethodName: undefined,
      },
      properties: new Map(),
      scope: undefined,
    };

    return fixture;
  }
}
