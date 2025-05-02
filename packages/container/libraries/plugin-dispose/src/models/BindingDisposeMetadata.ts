import { SingletonScopedBinding } from './SingletonScopedBinding';

export interface BindingDisposeMetadata {
  dependendentBindings: Set<SingletonScopedBinding>;
}
