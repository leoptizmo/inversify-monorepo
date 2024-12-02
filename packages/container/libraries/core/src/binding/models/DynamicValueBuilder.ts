import { ResolutionContext } from '../../resolution/models/ResolutionContext';

export type DynamicValueBuilder<T> = (
  context: ResolutionContext,
) => T | Promise<T>;
