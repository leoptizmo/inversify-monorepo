import { ConstantValueBinding } from '../../binding/models/ConstantValueBinding';
import { DynamicValueBinding } from '../../binding/models/DynamicValueBinding';
import { FactoryBinding } from '../../binding/models/FactoryBinding';
import { ProviderBinding } from '../../binding/models/ProviderBinding';
import { BaseBindingNode } from './BaseBindingNode';

export type LeafBindingNode = BaseBindingNode<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ConstantValueBinding<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | DynamicValueBinding<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | FactoryBinding<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ProviderBinding<any>
>;
