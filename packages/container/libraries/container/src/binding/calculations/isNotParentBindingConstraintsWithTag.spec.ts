import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  Mock,
  vitest,
} from 'vitest';

import { BindingConstraints, MetadataTag } from '@gritcode/inversifyjs-core';

vitest.mock('./isBindingConstraintsWithTag');
vitest.mock('./isNotParentBindingConstraints');

import { isBindingConstraintsWithTag } from './isBindingConstraintsWithTag';
import { isNotParentBindingConstraints } from './isNotParentBindingConstraints';
import { isNotParentBindingConstraintsWithTag } from './isNotParentBindingConstraintsWithTag';

describe(isNotParentBindingConstraintsWithTag.name, () => {
  let tagFixture: MetadataTag;
  let tagValueFixture: unknown;

  beforeAll(() => {
    tagFixture = 'tag-fixture';
    tagValueFixture = Symbol();
  });

  describe('when called', () => {
    let isBindingConstraintsWithNameResultMock: Mock<
      (constraints: BindingConstraints) => boolean
    >;
    let isNotParentBindingConstraintsResultMock: Mock<
      (constraints: BindingConstraints) => boolean
    >;

    let result: unknown;

    beforeAll(() => {
      isBindingConstraintsWithNameResultMock = vitest.fn();
      isNotParentBindingConstraintsResultMock = vitest.fn();

      vitest
        .mocked(isBindingConstraintsWithTag)
        .mockReturnValueOnce(isBindingConstraintsWithNameResultMock);

      vitest
        .mocked(isNotParentBindingConstraints)
        .mockReturnValueOnce(isNotParentBindingConstraintsResultMock);

      result = isNotParentBindingConstraintsWithTag(
        tagFixture,
        tagValueFixture,
      );
    });

    afterAll(() => {
      vitest.clearAllMocks();
    });

    it('should call isBindingConstraintsWithTag()', () => {
      expect(isBindingConstraintsWithTag).toHaveBeenCalledTimes(1);
      expect(isBindingConstraintsWithTag).toHaveBeenCalledWith(
        tagFixture,
        tagValueFixture,
      );
    });

    it('should call isNotParentBindingConstraints()', () => {
      expect(isNotParentBindingConstraints).toHaveBeenCalledTimes(1);
      expect(isNotParentBindingConstraints).toHaveBeenCalledWith(
        isBindingConstraintsWithNameResultMock,
      );
    });

    it('should return expected result', () => {
      expect(result).toBe(isNotParentBindingConstraintsResultMock);
    });
  });
});
