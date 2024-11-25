import { Binding } from '../../binding/models/Binding';
import { BindingNodeParent } from './BindingNodeParent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BaseBindingNode<TBinding extends Binding<any> = Binding<any>> {
  readonly parent: BindingNodeParent;
  readonly binding: TBinding;
}
