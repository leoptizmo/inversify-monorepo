import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { InstanceBindingNode } from './InstanceBindingNode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlanServiceNodeParent<TActivated = any> = InstanceBindingNode<
  InstanceBinding<TActivated>
>;
