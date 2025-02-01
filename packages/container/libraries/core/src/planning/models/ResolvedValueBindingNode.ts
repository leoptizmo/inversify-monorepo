import { ResolvedValueBinding } from '../../binding/models/ResolvedValueBinding';
import { BaseBindingNode } from './BaseBindingNode';
import { PlanServiceNode } from './PlanServiceNode';

export interface ResolvedValueBindingNode<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TBinding extends ResolvedValueBinding<any> = ResolvedValueBinding<any>,
> extends BaseBindingNode<TBinding> {
  readonly params: PlanServiceNode[];
}
