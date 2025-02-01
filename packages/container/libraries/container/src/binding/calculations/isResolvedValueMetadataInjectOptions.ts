import { LazyServiceIdentifier } from '@inversifyjs/common';

import {
  ResolvedValueInjectOptions,
  ResolvedValueMetadataInjectOptions,
} from '../models/ResolvedValueInjectOptions';

export function isResolvedValueMetadataInjectOptions<T>(
  options: ResolvedValueInjectOptions<T>,
): options is ResolvedValueMetadataInjectOptions<T> {
  return typeof options === 'object' && !LazyServiceIdentifier.is(options);
}
