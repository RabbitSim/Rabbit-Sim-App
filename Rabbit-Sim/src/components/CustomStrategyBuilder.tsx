import { useState } from 'react';
import { CustomStrategy, type ActionWeight, type CustomStrategyConfig } from '../classes/strategies/CustomStrategy';
import type { IStrategy } from '../classes/strategies/IStrategy';
import type { ActionNameKey } from '../classes/actions/ActionName';
import './component_styles/customStrategyBuilder.css';

interface CustomStrategyBuilderProps {
  onStrategyCreated: (strategy: IStrategy) => void;
  onCancel: () => void;
}

const AVAILABLE_ACTIONS: ActionNameKey[] = [
  'Attack',
  'Eat',
  'Sleep',
  'UPGRADE_AGRICULTURE',
  'UPGRADE_DEFENCE',
  'UPGRADE_OFFENSE',
  'HARVEST_FOOD',
  'MEDITATE',
];

const ACTION_DESCRIPTIONS: Record<ActionNameKey, string> = {
  Attack: 'Attack another colony',
  Eat: 'Consume food to sustain population',
  Sleep: 'Rest to restore energy',
  UPGRADE_AGRICULTURE: 'Improve food production',
  UPGRADE_DEFENCE: 'Strengthen defensive capabilities',
  UPGRADE_OFFENSE: 'Enhance attack power',
  HARVEST_FOOD: 'Gather food from the environment',
  MEDITATE: 'Reduce unrest and improve morale',
};

export function CustomStrategyBuilder({ onStrategyCreated, onCancel }: CustomStrategyBuilderProps) {
  const [strategyName, setStrategyName] = useState('My Custom Strategy');
  const [actionWeights, setActionWeights] = useState<ActionWeight[]>([
    { action: 'Eat', baseWeight: 5, conditions: { minFood: 1 } },
    { action: 'Sleep', baseWeight: 3 },
    { action: 'HARVEST_FOOD', baseWeight: 4, conditions: { maxFood: 500 } },
  ]);

  const addAction = () => {
    setActionWeights([
      ...actionWeights,
      { action: 'Sleep', baseWeight: 1 },
    ]);
  };

  const removeAction = (index: number) => {
    setActionWeights(actionWeights.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, field: keyof ActionWeight, value: any) => {
    const updated = [...actionWeights];
    updated[index] = { ...updated[index], [field]: value };
    setActionWeights(updated);
  };

  const updateCondition = (index: number, field: string, value: number | undefined) => {
    const updated = [...actionWeights];
    if (!updated[index].conditions) {
      updated[index].conditions = {};
    }
    if (value === undefined || value === null || isNaN(value)) {
      const cond: any = updated[index].conditions;
      delete cond[field];
    } else {
      const cond: any = updated[index].conditions;
      cond[field] = value;
    }
    setActionWeights(updated);
  };

  const handleCreate = () => {
    if (!strategyName.trim()) {
      alert('Please enter a strategy name');
      return;
    }
    if (actionWeights.length === 0) {
      alert('Please add at least one action');
      return;
    }

    const config: CustomStrategyConfig = {
      name: strategyName,
      actionWeights,
    };

    const strategy = new CustomStrategy(config);
    onStrategyCreated(strategy);
  };

  return (
    <div className="custom-strategy-builder">
      <div className="builder-header">
        <h2>Create Custom Strategy</h2>
        <button className="close-btn" onClick={onCancel}>✕</button>
      </div>

      <div className="builder-content">
        <div className="form-group">
          <label>Strategy Name:</label>
          <input
            type="text"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            placeholder="Enter strategy name"
            className="strategy-name-input"
          />
        </div>

        <div className="actions-section">
          <div className="section-header">
            <h3>Action Priorities</h3>
            <button className="add-action-btn" onClick={addAction}>+ Add Action</button>
          </div>

          <div className="actions-list">
            {actionWeights.map((aw, index) => (
              <div key={index} className="action-item">
                <div className="action-main">
                  <select
                    value={aw.action}
                    onChange={(e) => updateAction(index, 'action', e.target.value as ActionNameKey)}
                    className="action-select"
                  >
                    {AVAILABLE_ACTIONS.map(action => (
                      <option key={action} value={action}>
                        {action.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>

                  <div className="weight-control">
                    <label>Weight: {aw.baseWeight}</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={aw.baseWeight}
                      onChange={(e) => updateAction(index, 'baseWeight', parseInt(e.target.value))}
                      className="weight-slider"
                    />
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeAction(index)}
                    title="Remove action"
                  >
                    🗑️
                  </button>
                </div>

                <div className="action-description">
                  {ACTION_DESCRIPTIONS[aw.action]}
                </div>

                <details className="conditions-section">
                  <summary>Conditions (optional)</summary>
                  <div className="conditions-grid">
                    <div className="condition-input">
                      <label>Min Food:</label>
                      <input
                        type="number"
                        placeholder="No min"
                        value={aw.conditions?.minFood ?? ''}
                        onChange={(e) => updateCondition(index, 'minFood', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="condition-input">
                      <label>Max Food:</label>
                      <input
                        type="number"
                        placeholder="No max"
                        value={aw.conditions?.maxFood ?? ''}
                        onChange={(e) => updateCondition(index, 'maxFood', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="condition-input">
                      <label>Min Population:</label>
                      <input
                        type="number"
                        placeholder="No min"
                        value={aw.conditions?.minPopulation ?? ''}
                        onChange={(e) => updateCondition(index, 'minPopulation', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="condition-input">
                      <label>Max Population:</label>
                      <input
                        type="number"
                        placeholder="No max"
                        value={aw.conditions?.maxPopulation ?? ''}
                        onChange={(e) => updateCondition(index, 'maxPopulation', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="condition-input">
                      <label>Min Energy:</label>
                      <input
                        type="number"
                        placeholder="No min"
                        value={aw.conditions?.minEnergy ?? ''}
                        onChange={(e) => updateCondition(index, 'minEnergy', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                    <div className="condition-input">
                      <label>Max Energy:</label>
                      <input
                        type="number"
                        placeholder="No max"
                        value={aw.conditions?.maxEnergy ?? ''}
                        onChange={(e) => updateCondition(index, 'maxEnergy', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        <div className="builder-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="create-btn" onClick={handleCreate}>Create Strategy</button>
        </div>
      </div>
    </div>
  );
}
