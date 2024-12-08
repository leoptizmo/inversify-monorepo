import { Resolved } from '../../resolution/models/Resolved';

export type BindingActivation<T = unknown> = (injectable: T) => Resolved<T>;
