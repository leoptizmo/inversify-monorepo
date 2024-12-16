import { ClassMetadata } from '../models/ClassMetadata';

export function getDefaultClassMetadata(): ClassMetadata {
  return {
    constructorArguments: [],
    lifecycle: {
      postConstructMethodName: undefined,
      preDestroyMethodName: undefined,
    },
    properties: new Map(),
    scope: undefined,
  };
}
