import { LazyServiceIdentifier, ServiceIdentifier } from '@inversifyjs/common';

import { Binding } from '../../binding/models/Binding';
import { BindingMetadata } from '../../binding/models/BindingMetadata';
import {
  BindingMetadataImplementation,
  InternalBindingMetadata,
} from '../../binding/models/BindingMetadataImplementation';
import { bindingTypeValues } from '../../binding/models/BindingType';
import { InstanceBinding } from '../../binding/models/InstanceBinding';
import { ServiceRedirectionBinding } from '../../binding/models/ServiceRedirectionBinding';
import { SingleInmutableLinkedList } from '../../common/models/SingleInmutableLinkedList';
import { Writable } from '../../common/models/Writable';
import { ClassElementMetadata } from '../../metadata/models/ClassElementMetadata';
import { ClassElementMetadataKind } from '../../metadata/models/ClassElementMetadataKind';
import { ClassMetadata } from '../../metadata/models/ClassMetadata';
import { MetadataTag } from '../../metadata/models/MetadataTag';
import { addBranchService } from '../actions/addBranchService';
import { BasePlanParams } from '../models/BasePlanParams';
import { BindingNodeParent } from '../models/BindingNodeParent';
import { InstanceBindingNode } from '../models/InstanceBindingNode';
import { PlanBindingNode } from '../models/PlanBindingNode';
import { PlanParams } from '../models/PlanParams';
import { PlanResult } from '../models/PlanResult';
import { PlanServiceNode } from '../models/PlanServiceNode';
import { PlanServiceRedirectionBindingNode } from '../models/PlanServiceRedirectionBindingNode';
import { SubplanParams } from '../models/SubplanParams';
import { buildFilteredServiceBindings } from './buildFilteredServiceBindings';
import { checkServiceNodeSingleInjectionBindings } from './checkServiceNodeSingleInjectionBindings';
import { isPlanServiceRedirectionBindingNode } from './isPlanServiceRedirectionBindingNode';

export function plan(params: PlanParams): PlanResult {
  const tags: Map<MetadataTag, unknown> = new Map();

  if (params.rootConstraints.tag !== undefined) {
    tags.set(params.rootConstraints.tag.key, params.rootConstraints.tag.value);
  }

  const bindingMetadataList: SingleInmutableLinkedList<InternalBindingMetadata> =
    new SingleInmutableLinkedList({
      elem: {
        name: params.rootConstraints.name,
        serviceIdentifier: params.rootConstraints.serviceIdentifier,
        tags,
      },
      previous: undefined,
    });

  const bindingMetadata: BindingMetadata = new BindingMetadataImplementation(
    bindingMetadataList.last,
  );

  const filteredServiceBindings: Binding<unknown>[] =
    buildFilteredServiceBindings(params, bindingMetadata);

  const serviceNodeBindings: PlanBindingNode[] = [];

  const serviceNode: PlanServiceNode = {
    bindings: serviceNodeBindings,
    parent: undefined,
    serviceIdentifier: params.rootConstraints.serviceIdentifier,
  };

  serviceNodeBindings.push(
    ...buildServiceNodeBindings(
      params,
      bindingMetadataList,
      filteredServiceBindings,
      serviceNode,
    ),
  );

  if (!params.rootConstraints.isMultiple) {
    checkServiceNodeSingleInjectionBindings(
      serviceNode,
      params.rootConstraints.isOptional ?? false,
      bindingMetadata,
    );

    const [planBindingNode]: PlanBindingNode[] = serviceNodeBindings;

    (serviceNode as Writable<PlanServiceNode>).bindings = planBindingNode;
  }

  return {
    tree: {
      root: serviceNode,
    },
  };
}

function buildInstancePlanBindingNode(
  params: BasePlanParams,
  binding: InstanceBinding<unknown>,
  bindingMetadataList: SingleInmutableLinkedList<InternalBindingMetadata>,
  parentNode: BindingNodeParent,
): PlanBindingNode {
  const classMetadata: ClassMetadata = params.getClassMetadata(
    binding.implementationType,
  );

  const childNode: InstanceBindingNode = {
    binding: binding,
    classMetadata,
    constructorParams: [],
    parent: parentNode,
    propertyParams: new Map(),
  };

  const subplanParams: SubplanParams = {
    autobindOptions: params.autobindOptions,
    getBindings: params.getBindings,
    getClassMetadata: params.getClassMetadata,
    node: childNode,
    servicesBranch: params.servicesBranch,
    setBinding: params.setBinding,
  };

  return subplan(subplanParams, bindingMetadataList);
}

function buildPlanServiceNodeFromClassElementMetadata(
  params: SubplanParams,
  bindingMetadataList: SingleInmutableLinkedList<InternalBindingMetadata>,
  elementMetadata: ClassElementMetadata,
): PlanServiceNode | undefined {
  if (elementMetadata.kind === ClassElementMetadataKind.unmanaged) {
    return undefined;
  }

  const serviceIdentifier: ServiceIdentifier = LazyServiceIdentifier.is(
    elementMetadata.value,
  )
    ? elementMetadata.value.unwrap()
    : elementMetadata.value;

  const updatedBindingMetadataList: SingleInmutableLinkedList<InternalBindingMetadata> =
    bindingMetadataList.concat({
      name: elementMetadata.name,
      serviceIdentifier,
      tags: elementMetadata.tags,
    });

  const bindingMetadata: BindingMetadata = new BindingMetadataImplementation(
    updatedBindingMetadataList.last,
  );

  const filteredServiceBindings: Binding<unknown>[] =
    buildFilteredServiceBindings(params, bindingMetadata);

  const serviceNodeBindings: PlanBindingNode[] = [];

  const serviceNode: PlanServiceNode = {
    bindings: serviceNodeBindings,
    parent: params.node,
    serviceIdentifier,
  };

  serviceNodeBindings.push(
    ...buildServiceNodeBindings(
      params,
      updatedBindingMetadataList,
      filteredServiceBindings,
      serviceNode,
    ),
  );

  if (elementMetadata.kind === ClassElementMetadataKind.singleInjection) {
    checkServiceNodeSingleInjectionBindings(
      serviceNode,
      elementMetadata.optional,
      bindingMetadata,
    );

    const [planBindingNode]: PlanBindingNode[] = serviceNodeBindings;

    (serviceNode as Writable<PlanServiceNode>).bindings = planBindingNode;
  }

  return serviceNode;
}

function buildServiceNodeBindings(
  params: BasePlanParams,
  bindingMetadataList: SingleInmutableLinkedList<InternalBindingMetadata>,
  serviceBindings: Binding<unknown>[],
  parentNode: BindingNodeParent,
): PlanBindingNode[] {
  const serviceIdentifier: ServiceIdentifier =
    isPlanServiceRedirectionBindingNode(parentNode)
      ? parentNode.binding.targetServiceIdentifier
      : parentNode.serviceIdentifier;

  addBranchService(params, serviceIdentifier);

  const planBindingNodes: PlanBindingNode[] = [];

  for (const binding of serviceBindings) {
    switch (binding.type) {
      case bindingTypeValues.Instance: {
        planBindingNodes.push(
          buildInstancePlanBindingNode(
            params,
            binding,
            bindingMetadataList,
            parentNode,
          ),
        );
        break;
      }
      case bindingTypeValues.ServiceRedirection: {
        const planBindingNode: PlanBindingNode | undefined =
          buildServiceRedirectionPlanBindingNode(
            params,
            bindingMetadataList,
            binding,
            parentNode,
          );

        planBindingNodes.push(planBindingNode);

        break;
      }
      default:
        planBindingNodes.push({
          binding: binding,
          parent: parentNode,
        });
    }
  }

  params.servicesBranch.delete(serviceIdentifier);

  return planBindingNodes;
}

function buildServiceRedirectionPlanBindingNode(
  params: BasePlanParams,
  bindingMetadataList: SingleInmutableLinkedList<InternalBindingMetadata>,
  binding: ServiceRedirectionBinding<unknown>,
  parentNode: BindingNodeParent,
): PlanBindingNode {
  const childNode: PlanServiceRedirectionBindingNode = {
    binding,
    parent: parentNode,
    redirections: [],
  };

  const bindingMetadata: BindingMetadata = new BindingMetadataImplementation(
    bindingMetadataList.last,
  );

  const filteredServiceBindings: Binding<unknown>[] =
    buildFilteredServiceBindings(params, bindingMetadata, {
      customServiceIdentifier: binding.targetServiceIdentifier,
    });

  childNode.redirections.push(
    ...buildServiceNodeBindings(
      params,
      bindingMetadataList,
      filteredServiceBindings,
      childNode,
    ),
  );

  return childNode;
}

function subplan(
  params: SubplanParams,
  bindingMetadataList: SingleInmutableLinkedList<InternalBindingMetadata>,
): PlanBindingNode {
  const classMetadata: ClassMetadata = params.node.classMetadata;

  for (const [
    index,
    elementMetadata,
  ] of classMetadata.constructorArguments.entries()) {
    params.node.constructorParams[index] =
      buildPlanServiceNodeFromClassElementMetadata(
        params,
        bindingMetadataList,
        elementMetadata,
      );
  }

  for (const [propertyKey, elementMetadata] of classMetadata.properties) {
    const planServiceNode: PlanServiceNode | undefined =
      buildPlanServiceNodeFromClassElementMetadata(
        params,
        bindingMetadataList,
        elementMetadata,
      );

    if (planServiceNode !== undefined) {
      params.node.propertyParams.set(propertyKey, planServiceNode);
    }
  }

  return params.node;
}
