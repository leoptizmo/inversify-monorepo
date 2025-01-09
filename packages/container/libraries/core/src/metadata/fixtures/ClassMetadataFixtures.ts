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
      scope: undefined,
    };

    return fixture;
  }

  public static get withNoPreDestroyMethodName(): ClassMetadata {
    const fixture: ClassMetadata = {
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

  public static get withPreDestroyMethodName(): ClassMetadata {
    const fixture: ClassMetadata = {
      constructorArguments: [],
      lifecycle: {
        postConstructMethodName: undefined,
        preDestroyMethodName: 'preDestroy',
      },
      properties: new Map(),
      scope: undefined,
    };

    return fixture;
  }
}
