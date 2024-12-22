import { beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../actions/getContainerModuleId');

import { getContainerModuleId } from '../actions/getContainerModuleId';
import { ContainerModule, ContainerModuleLoadOptions } from './ContainerModule';

describe(ContainerModule.name, () => {
  let containerModuleIdfixture: number;
  let loadMock: jest.Mock<
    (options: ContainerModuleLoadOptions) => Promise<void>
  >;

  beforeAll(() => {
    containerModuleIdfixture = 1;
    loadMock = jest.fn();

    (
      getContainerModuleId as jest.Mock<typeof getContainerModuleId>
    ).mockReturnValue(containerModuleIdfixture);
  });

  describe('.id', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = new ContainerModule(loadMock).id;
      });

      it('should return expected value', () => {
        expect(result).toBe(containerModuleIdfixture);
      });
    });
  });

  describe('.load', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = new ContainerModule(loadMock).load;
      });

      it('should return expected value', () => {
        expect(result).toBe(loadMock);
      });
    });
  });
});
