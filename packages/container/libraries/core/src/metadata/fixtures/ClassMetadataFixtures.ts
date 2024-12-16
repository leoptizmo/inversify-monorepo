import { ClassMetadata } from '../models/ClassMetadata';

export class ClassMetadataFixtures {
  public static get any(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      lifecycle: {
        postConstructMethodName: undefined,
        preDestroyMethodName: undefined,
      },
      properties: new Map(),
    };

    return fixture;
  }
}
