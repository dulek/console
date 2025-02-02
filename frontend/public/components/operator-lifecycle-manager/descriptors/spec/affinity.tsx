import * as React from 'react';
import * as _ from 'lodash';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';

import { MatchExpressions } from './match-expressions';
import { NodeAffinity as NodeAffinityType, MatchExpression, PodAffinity as PodAffinityType } from '../../../../module/k8s';
import { Tooltip } from '../../../utils/tooltip';

const requiredTooltip = 'Required rules must be met before a pod can be scheduled on a node.';
const preferredTooltip = 'Preferred rules specify that, if the rule is met, the scheduler tries to enforce the rules, but does not guarantee enforcement.';
const defaultMatchExpression: MatchExpression = {key: '', operator: 'Exists'};

export const defaultNodeAffinity = {
  requiredDuringSchedulingIgnoredDuringExecution: {
    nodeSelectorTerms: [{matchExpressions: [_.cloneDeep(defaultMatchExpression)]}],
  },
  preferredDuringSchedulingIgnoredDuringExecution: [{
    weight: 1,
    preference: {matchExpressions: [_.cloneDeep(defaultMatchExpression)]},
  }],
} as NodeAffinityType;

export const NodeAffinity: React.FC<NodeAffinityProps> = (props) => {
  const {affinity} = props;

  const addRequired = () => _.set(affinity, 'requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms',
    affinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.concat([{matchExpressions: []}])
  );
  const removeRequired = (at: number) => _.set(affinity, 'requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms',
    affinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.filter((v, i) => at !== i)
  );
  const addPreference = () => _.set(affinity, 'preferredDuringSchedulingIgnoredDuringExecution',
    affinity.preferredDuringSchedulingIgnoredDuringExecution.concat([{weight: 1, preference: {matchExpressions: []}}])
  );
  const removePreferred = (at: number) => _.set(affinity, 'preferredDuringSchedulingIgnoredDuringExecution',
    affinity.preferredDuringSchedulingIgnoredDuringExecution.filter((v, i) => at !== i)
  );

  return <dl>
    <Tooltip content={requiredTooltip}>
      <dt>Required During Scheduling Ignored During Execution</dt>
    </Tooltip>
    <dd>
      { affinity.requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.map((nodeSelector, i) => <div key={i} className="co-affinity-term">
        { i > 0 && <button
          type="button"
          className="btn btn-link co-affinity-term__remove"
          style={{marginLeft: 'auto'}}
          onClick={() => props.onChangeAffinity(removeRequired(i))}>
          <MinusCircleIcon className="co-icon-space-r" />Remove Required
        </button> }
        <MatchExpressions
          matchExpressions={nodeSelector.matchExpressions || [] as MatchExpression[]}
          onChangeMatchExpressions={matchExpressions => props.onChangeAffinity(_.set(affinity, `requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms[${i}].matchExpressions`, matchExpressions))}
          allowedOperators={['In', 'NotIn', 'Exists', 'DoesNotExist']} />
      </div>) }
      <div className="row">
        <button
          type="button"
          className="btn btn-link"
          style={{marginLeft: '10px'}}
          onClick={() => props.onChangeAffinity(addRequired())}>
          <PlusCircleIcon className="co-icon-space-r" />Add Required
        </button>
      </div>
    </dd>
    <Tooltip content={preferredTooltip}>
      <dt>Preferred During Scheduling Ignored During Execution</dt>
    </Tooltip>
    <dd>
      { affinity.preferredDuringSchedulingIgnoredDuringExecution.map(({weight, preference}, i) => <div key={i} className="co-affinity-term">
        { i > 0 && <button
          type="button"
          className="btn btn-link co-affinity-term__remove"
          onClick={() => props.onChangeAffinity(removePreferred(i))}>
          <MinusCircleIcon className="co-icon-space-r" />Remove Preferred
        </button> }
        <label className="control-label co-required" htmlFor={`preference-${i}`}>Weight</label>
        <input
          className="pf-c-form-control"
          type="number"
          value={weight || affinity.preferredDuringSchedulingIgnoredDuringExecution[i - 1].weight + 1}
          onChange={e => props.onChangeAffinity(_.set(affinity, `preferredDuringSchedulingIgnoredDuringExecution[${i}].weight`, _.toInteger(e.target.value)))}
          required />
        <MatchExpressions
          matchExpressions={preference.matchExpressions || [] as MatchExpression[]}
          onChangeMatchExpressions={matchExpressions => props.onChangeAffinity(_.set(affinity, `preferredDuringSchedulingIgnoredDuringExecution[${i}].preference.matchExpressions`, matchExpressions))}
          allowedOperators={['In', 'NotIn', 'Exists', 'DoesNotExist']} />
      </div>) }
      <div className="row">
        <button
          type="button"
          className="btn btn-link"
          style={{marginLeft: '10px'}}
          onClick={() => props.onChangeAffinity(addPreference())}>
          <PlusCircleIcon className="co-icon-space-r" />Add Preferred
        </button>
      </div>
    </dd>
  </dl>;
};

export const defaultPodAffinity = {
  requiredDuringSchedulingIgnoredDuringExecution: [{
    topologyKey: 'failure-domain.beta.kubernetes.io/zone',
    labelSelector: {matchExpressions: [_.cloneDeep(defaultMatchExpression)]},
  }],
  preferredDuringSchedulingIgnoredDuringExecution: [{
    weight: 1,
    podAffinityTerm: {
      topologyKey: 'failure-domain.beta.kubernetes.io/zone',
      labelSelector: {matchExpressions: [_.cloneDeep(defaultMatchExpression)]},
    },
  }],
} as PodAffinityType;

export const PodAffinity: React.FC<PodAffinityProps> = (props) => {
  const {affinity} = props;

  const addRequired = () => _.set(affinity, 'requiredDuringSchedulingIgnoredDuringExecution',
    affinity.requiredDuringSchedulingIgnoredDuringExecution.concat([{topologyKey: '', labelSelector: {matchExpressions: []}}])
  );
  const removeRequired = (at: number) => _.set(affinity, 'requiredDuringSchedulingIgnoredDuringExecution',
    affinity.requiredDuringSchedulingIgnoredDuringExecution.filter((v, i) => at !== i)
  );
  const addPreference = () => _.set(affinity, 'preferredDuringSchedulingIgnoredDuringExecution',
    affinity.preferredDuringSchedulingIgnoredDuringExecution.concat([{weight: 1, podAffinityTerm: {topologyKey: '', labelSelector: {matchExpressions: []}}}])
  );
  const removePreferred = (at: number) => _.set(affinity, 'preferredDuringSchedulingIgnoredDuringExecution',
    affinity.preferredDuringSchedulingIgnoredDuringExecution.filter((v, i) => at !== i)
  );

  return <dl>
    <Tooltip content={requiredTooltip}>
      <dt>Required During Scheduling Ignored During Execution</dt>
    </Tooltip>
    <dd>
      { affinity.requiredDuringSchedulingIgnoredDuringExecution.map((podAffinityTerm, i) => <div key={i} className="co-affinity-term">
        { i > 0 && <button
          type="button"
          className="btn btn-link co-affinity-term__remove"
          onClick={() => props.onChangeAffinity(removeRequired(i))}>
          <MinusCircleIcon className="co-icon-space-r" />Remove Preferred
        </button> }
        <div className="co-affinity-term__topology">
          <div className="co-affinity-term__topology-input">
            <label className="control-label co-required" htmlFor={`topology-${i}`}>Topology Key</label>
            <input
              className="pf-c-form-control"
              type="text"
              value={affinity.requiredDuringSchedulingIgnoredDuringExecution[i].topologyKey || ''}
              onChange={e => props.onChangeAffinity(_.set(affinity, `requiredDuringSchedulingIgnoredDuringExecution[${i}].topologyKey`, e.target.value))}
              required />
          </div>
        </div>
        <MatchExpressions
          matchExpressions={podAffinityTerm.labelSelector.matchExpressions || [] as MatchExpression[]}
          onChangeMatchExpressions={matchExpressions => props.onChangeAffinity(_.set(affinity, `requiredDuringSchedulingIgnoredDuringExecution[${i}].labelSelector.matchExpressions`, matchExpressions))}
          allowedOperators={['In', 'NotIn', 'Exists', 'DoesNotExist']} />
      </div>) }
      <div className="row">
        <button
          type="button"
          className="btn btn-link"
          style={{marginLeft: '10px'}}
          onClick={() => props.onChangeAffinity(addRequired())}>
          <PlusCircleIcon className="co-icon-space-r" />Add Required
        </button>
      </div>
    </dd>
    <Tooltip content={preferredTooltip}>
      <dt>Preferred During Scheduling Ignored During Execution</dt>
    </Tooltip>
    <dd>
      { affinity.preferredDuringSchedulingIgnoredDuringExecution.map(({weight, podAffinityTerm}, i) => <div key={i} className="co-affinity-term">
        { i > 0 && <button
          type="button"
          className="btn btn-link co-affinity-term__remove"
          onClick={() => props.onChangeAffinity(removePreferred(i))}>
          <MinusCircleIcon className="co-icon-space-r" />Remove Preferred
        </button> }
        <div className="co-affinity-term__topology">
          <div className="co-affinity-term__topology-input">
            <label className="control-label co-required" htmlFor={`preference-${i}`}>Weight</label>
            <input
              className="pf-c-form-control"
              type="number"
              value={weight || affinity.preferredDuringSchedulingIgnoredDuringExecution[i - 1].weight + 1}
              onChange={e => props.onChangeAffinity(_.set(affinity, `preferredDuringSchedulingIgnoredDuringExecution[${i}].weight`, _.toInteger(e.target.value)))}
              required />
          </div>
          <div className="co-affinity-term__topology-input">
            <label className="control-label co-required" htmlFor={`topology-${i}`}>Topology Key</label>
            <input
              className="pf-c-form-control"
              type="text"
              value={affinity.preferredDuringSchedulingIgnoredDuringExecution[i].podAffinityTerm.topologyKey || ''}
              onChange={e => props.onChangeAffinity(_.set(affinity, `preferredDuringSchedulingIgnoredDuringExecution[${i}].podAffinityTerm.topologyKey`, e.target.value))}
              required />
          </div>
        </div>
        <MatchExpressions
          matchExpressions={podAffinityTerm.labelSelector.matchExpressions || [] as MatchExpression[]}
          onChangeMatchExpressions={matchExpressions => props.onChangeAffinity(_.set(affinity, `preferredDuringSchedulingIgnoredDuringExecution[${i}].podAffinityTerm.labelSelector.matchExpressions`, matchExpressions))}
          allowedOperators={['In', 'NotIn', 'Exists', 'DoesNotExist']} />
      </div>) }
      <div className="row">
        <button
          type="button"
          className="btn btn-link"
          style={{marginLeft: '10px'}}
          onClick={() => props.onChangeAffinity(addPreference())}>
          <PlusCircleIcon className="co-icon-space-r" />Add Preferred
        </button>
      </div>
    </dd>
  </dl>;
};

export type NodeAffinityProps = {
  affinity: NodeAffinityType;
  onChangeAffinity: (affinity: NodeAffinityType) => void;
};

export type PodAffinityProps = {
  affinity: PodAffinityType;
  onChangeAffinity: (affinity: PodAffinityType) => void;
};

NodeAffinity.displayName = 'NodeAffinity';
PodAffinity.displayName = 'PodAffinity';
