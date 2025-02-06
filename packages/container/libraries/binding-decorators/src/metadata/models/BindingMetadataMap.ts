import { Newable } from 'inversify';

import { BindingMetadata } from './BindingMetadata';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BindingMetadataMap = Map<Newable, BindingMetadata<any>[]>;
