import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../prototype/calculations/getBaseType');
jest.mock('./getTargetId');

import { Newable } from '@inversifyjs/common';

import { ClassElementMetadata } from '../../metadata/models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../../metadata/models/ClassElementMetadataKind';
import { ClassMetadata } from '../../metadata/models/ClassMetadata';
import { ManagedClassElementMetadata } from '../../metadata/models/ManagedClassElementMetadata';
import { getBaseType } from '../../prototype/calculations/getBaseType';
import { LegacyTarget } from '../models/LegacyTarget';
import { LegacyTargetImpl } from '../models/LegacyTargetImpl';
import { getTargetId } from './getTargetId';
import { getTargetsFromMetadataProviders } from './getTargetsFromMetadataProviders';

describe(getTargetsFromMetadataProviders.name, () => {
  describe('having a type with a base type', () => {
    let getClassMetadataMock: jest.Mock<(type: Newable) => ClassMetadata>;
    let getClassMetadataPropertiesMock: jest.Mock<
      (type: Newable) => Map<string | symbol, ClassElementMetadata>
    >;

    class BaseType {}

    class Type extends BaseType {}

    beforeAll(() => {
      getClassMetadataMock = jest.fn();
      getClassMetadataPropertiesMock = jest.fn();
    });

    describe('when called, and getClassMetadataProperties() returns new and existing properties', () => {
      let existingProperty: string;
      let newProperty: string;

      let targetIdFixture: number;

      let classMetadataFixture: ClassMetadata;
      let constructorParamMetadata: ManagedClassElementMetadata;
      let existingPropertyBaseMetadata: ClassElementMetadata;
      let existingPropertyMetadata: ManagedClassElementMetadata;
      let newPropertyMetadata: ManagedClassElementMetadata;

      let result: unknown;

      beforeAll(() => {
        existingProperty = 'existing-property';
        newProperty = 'new-property';

        targetIdFixture = 13;

        constructorParamMetadata = {
          kind: ClassElementMetadataKind.multipleInjection,
          name: 'constructor-name-fixture',
          optional: false,
          tags: new Map(),
          targetName: 'constructor-target-name-fixture',
          value: Symbol(),
        };

        existingPropertyMetadata = {
          kind: ClassElementMetadataKind.singleInjection,
          name: 'existing-name-fixture',
          optional: false,
          tags: new Map(),
          targetName: 'existing-target-name-fixture',
          value: Symbol(),
        };

        existingPropertyBaseMetadata = {
          kind: ClassElementMetadataKind.singleInjection,
          name: 'existing-base-name-fixture',
          optional: false,
          tags: new Map(),
          targetName: 'existing-base-target-name-fixture',
          value: Symbol(),
        };

        newPropertyMetadata = {
          kind: ClassElementMetadataKind.singleInjection,
          name: 'new-name-fixture',
          optional: false,
          tags: new Map(),
          targetName: 'new-target-name-fixture',
          value: Symbol(),
        };

        classMetadataFixture = {
          constructorArguments: [constructorParamMetadata],
          lifecycle: {
            postConstructMethodName: undefined,
            preDestroyMethodName: undefined,
          },
          properties: new Map([
            [existingProperty, existingPropertyBaseMetadata],
          ]),
        };

        (getTargetId as jest.Mock<typeof getTargetId>).mockReturnValue(
          targetIdFixture,
        );

        (getBaseType as jest.Mock<typeof getBaseType>)
          .mockReturnValueOnce(BaseType)
          .mockReturnValueOnce(Object);

        getClassMetadataMock.mockReturnValueOnce(classMetadataFixture);
        getClassMetadataPropertiesMock.mockReturnValueOnce(
          new Map([
            [existingProperty, existingPropertyMetadata],
            [newProperty, newPropertyMetadata],
          ]),
        );

        result = getTargetsFromMetadataProviders(
          getClassMetadataMock,
          getClassMetadataPropertiesMock,
        )(Type);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getClassMetadataMock()', () => {
        expect(getClassMetadataMock).toHaveBeenCalledTimes(1);
        expect(getClassMetadataMock).toHaveBeenCalledWith(Type);
      });

      it('should call getBaseType', () => {
        expect(getBaseType).toHaveBeenCalledTimes(2);
        expect(getBaseType).toHaveBeenNthCalledWith(1, Type);
        expect(getBaseType).toHaveBeenNthCalledWith(2, BaseType);
      });

      it('should call getClassMetadataPropertiesMock()', () => {
        expect(getClassMetadataPropertiesMock).toHaveBeenCalledTimes(1);
        expect(getClassMetadataPropertiesMock).toHaveBeenCalledWith(BaseType);
      });

      it('should return LegacyTarget[]', () => {
        const expected: LegacyTarget[] = [
          new LegacyTargetImpl(
            '',
            constructorParamMetadata,
            'ConstructorArgument',
          ),
          new LegacyTargetImpl(
            existingProperty,
            existingPropertyMetadata,
            'ClassProperty',
          ),
          new LegacyTargetImpl(
            newProperty,
            newPropertyMetadata,
            'ClassProperty',
          ),
        ];

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
