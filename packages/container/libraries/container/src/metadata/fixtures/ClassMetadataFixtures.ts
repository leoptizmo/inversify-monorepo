import { bindingScopeValues, ClassMetadata } from '@gritcode/inversifyjs-core';

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

  public static get withScopeRequest(): ClassMetadata {
    const fixture: ClassMetadata = {
      ...ClassMetadataFixtures.any,
      scope: bindingScopeValues.Request,
    };

    return fixture;
  }

  public static get withScopeUndefined(): ClassMetadata {
    const fixture: ClassMetadata = {
      ...ClassMetadataFixtures.any,
      scope: undefined,
    };

    return fixture;
  }
}
