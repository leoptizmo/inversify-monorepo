import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { ResolvedValueBinding } from '../../binding/models/ResolvedValueBinding';
import { InstanceBindingNode } from './InstanceBindingNode';
import { ResolvedValueBindingNode } from './ResolvedValueBindingNode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlanServiceNodeParent<TActivated = any> =
  | InstanceBindingNode<InstanceBinding<TActivated>>
  | ResolvedValueBindingNode<ResolvedValueBinding<TActivated>>;
