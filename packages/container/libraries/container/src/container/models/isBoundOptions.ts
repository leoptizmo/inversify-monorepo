import {
  GetOptionsTagConstraint,
  MetadataName,
} from '@gritcode/inversifyjs-core';

export interface IsBoundOptions {
  name?: MetadataName;
  tag?: GetOptionsTagConstraint;
}
