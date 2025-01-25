import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import { PlanResult } from '../models/PlanResult';
import {
  GetPlanOptions,
  PlanResultCacheService,
} from './PlanResultCacheService';

describe(PlanResultCacheService.name, () => {
  describe('.set', () => {
    describe.each<[string, GetPlanOptions]>([
      [
        'isMultiple false and optional false',
        {
          isMultiple: false,
          optional: false,
          serviceId: 'service-id',
        },
      ],
      [
        'isMultiple false and optional true',
        {
          isMultiple: false,
          optional: true,
          serviceId: 'service-id',
        },
      ],
      [
        'isMultiple true and optional false',
        {
          isMultiple: true,
          optional: false,
          serviceId: 'service-id',
        },
      ],
      [
        'isMultiple true and optional true',
        {
          isMultiple: true,
          optional: true,
          serviceId: 'service-id',
        },
      ],
      [
        'isMultiple false, optional false and name',
        {
          isMultiple: false,
          name: 'name',
          optional: false,
          serviceId: 'service-id',
        },
      ],
      [
        'isMultiple false, optional true and name',
        {
          isMultiple: false,
          name: 'name',
          optional: true,
          serviceId: 'service-id',
        },
      ],
      [
        'isMultiple true, optional false and name',
        {
          isMultiple: true,
          name: 'name',
          optional: false,
          serviceId: 'service-id',
        },
      ],
      [
        'isMultiple true, optional true and name',
        {
          isMultiple: true,
          name: 'name',
          optional: true,
          serviceId: 'service-id',
        },
      ],
      [
        'isMultiple false, optional false and tag',
        {
          isMultiple: false,
          optional: false,
          serviceId: 'service-id',
          tag: {
            key: 'key',
            value: 'value',
          },
        },
      ],
      [
        'isMultiple false, optional true and tag',
        {
          isMultiple: false,
          optional: true,
          serviceId: 'service-id',
          tag: {
            key: 'key',
            value: 'value',
          },
        },
      ],
      [
        'isMultiple true, optional false and tag',
        {
          isMultiple: true,
          optional: false,
          serviceId: 'service-id',
          tag: {
            key: 'key',
            value: 'value',
          },
        },
      ],
      [
        'isMultiple true, optional true and tag',
        {
          isMultiple: true,
          optional: true,
          serviceId: 'service-id',
          tag: {
            key: 'key',
            value: 'value',
          },
        },
      ],
      [
        'isMultiple false, optional false, name and tag',
        {
          isMultiple: false,
          name: 'name',
          optional: false,
          serviceId: 'service-id',
          tag: {
            key: 'key',
            value: 'value',
          },
        },
      ],
      [
        'isMultiple false, optional true, name and tag',
        {
          isMultiple: false,
          name: 'name',
          optional: true,
          serviceId: 'service-id',
          tag: {
            key: 'key',
            value: 'value',
          },
        },
      ],
      [
        'isMultiple true, optional false, name and tag',
        {
          isMultiple: true,
          name: 'name',
          optional: false,
          serviceId: 'service-id',
          tag: {
            key: 'key',
            value: 'value',
          },
        },
      ],
      [
        'isMultiple true, optional true, name and tag',
        {
          isMultiple: true,
          name: 'name',
          optional: true,
          serviceId: 'service-id',
          tag: {
            key: 'key',
            value: 'value',
          },
        },
      ],
    ])('having options with  %s', (_: string, options: GetPlanOptions) => {
      describe('when called', () => {
        let planService: PlanResultCacheService;

        let planResult: PlanResult;

        beforeAll(() => {
          planService = new PlanResultCacheService();

          planResult = {} as PlanResult;
          planService.set(options, planResult);
        });

        it('should store the plan result', () => {
          expect(planService.get(options)).toBe(planResult);
        });
      });
    });
  });

  describe('.clearCache', () => {
    let options: GetPlanOptions;

    beforeAll(() => {
      options = {
        isMultiple: false,
        optional: false,
        serviceId: 'service-id',
      };
    });

    describe('when called', () => {
      let planService: PlanResultCacheService;

      let planResult: PlanResult;

      beforeAll(() => {
        planService = new PlanResultCacheService();

        planResult = {} as PlanResult;
        planService.set(options, planResult);
        planService.clearCache();
      });

      it('should clear the cache', () => {
        expect(planService.get(options)).toBeUndefined();
      });
    });

    describe('when called with subscribers', () => {
      let planService: PlanResultCacheService;
      let subscriberMock: jest.Mocked<PlanResultCacheService>;

      beforeAll(() => {
        planService = new PlanResultCacheService();
        subscriberMock = {
          clearCache: jest.fn(),
          // ...other mocked methods...
        } as unknown as jest.Mocked<PlanResultCacheService>;

        planService.subscribe(subscriberMock);
        planService.clearCache();
      });

      it('should call subscriber.clearCache()', () => {
        expect(subscriberMock.clearCache).toHaveBeenCalledTimes(1);
        expect(subscriberMock.clearCache).toHaveBeenCalledWith();
      });
    });
  });
});
