import { beforeAll, describe, expect, it } from 'vitest';

import {
  bindingTypeValues,
  LeafBindingNode,
  PlanServiceNodeParent,
} from '@gritcode/inversifyjs-core';

import { isResolvedValueBindingNode } from './isResolvedValueBindingNode';

describe(isResolvedValueBindingNode, () => {
  describe.each<[string, PlanServiceNodeParent | LeafBindingNode, boolean]>([
    [
      'a non ResolvedValueBindingNode',
      {
        binding: {
          type: bindingTypeValues.Instance,
        },
      } as Partial<PlanServiceNodeParent | LeafBindingNode> as
        | PlanServiceNodeParent
        | LeafBindingNode,
      false,
    ],
    [
      'a ResolvedValueBindingNode',
      {
        binding: {
          type: bindingTypeValues.ResolvedValue,
        },
      } as Partial<PlanServiceNodeParent | LeafBindingNode> as
        | PlanServiceNodeParent
        | LeafBindingNode,
      true,
    ],
  ])(
    'given %s',
    (
      _: string,
      node: PlanServiceNodeParent | LeafBindingNode,
      expectedResult: boolean,
    ) => {
      describe('when called', () => {
        let result: boolean;

        beforeAll(() => {
          result = isResolvedValueBindingNode(node);
        });

        it('should return expected result', () => {
          expect(result).toBe(expectedResult);
        });
      });
    },
  );
});
