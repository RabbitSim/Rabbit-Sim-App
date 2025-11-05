import { useState } from 'react';
import { AggressiveStrategy } from '../classes/strategies/AggressiveStrategy';
import { DefensiveStrategy } from '../classes/strategies/DefensiveStrategy';
import { FraserStrategy } from '../classes/strategies/FraserStrategy';
import { OnlySleepAndEat } from '../classes/strategies/OnlySleepAndEat';
import { PacifistStrategy } from '../classes/strategies/PacifistStrategy';
import { RandomStrategy } from '../classes/strategies/RandomStrategy';
import { StarveThemOutStrategy } from '../classes/strategies/StarveThemOutStrategy';
import { CustomStrategyBuilder } from './CustomStrategyBuilder';
import type { IStrategy } from '../classes/strategies/IStrategy';
import './component_styles/strategyPicker.css';

interface StrategyOption {
  name: string;
  create: () => IStrategy;
  description: string;
}

const AVAILABLE_STRATEGIES: StrategyOption[] = [
  { name: 'Aggressive', create: () => new AggressiveStrategy(), description: 'Focus on attacking other colonies' },
  { name: 'Defensive', create: () => new DefensiveStrategy(), description: 'Prioritize defense and survival' },
  { name: 'Fraser', create: () => new FraserStrategy(), description: 'Balanced custom strategy' },
  { name: 'Sleep & Eat', create: () => new OnlySleepAndEat(), description: 'Simple survival strategy' },
  { name: 'Pacifist', create: () => new PacifistStrategy(), description: 'Avoid conflict entirely' },
  { name: 'Random', create: () => new RandomStrategy(), description: 'Unpredictable actions' },
  { name: 'Starve Them Out', create: () => new StarveThemOutStrategy(), description: 'Economic warfare' },
];

interface StrategyPickerProps {
  onRunSimulation: (strategies: IStrategy[], runCount: number) => void;
  isRunning: boolean;
}

export function StrategyPicker({ onRunSimulation, isRunning }: StrategyPickerProps) {
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [runCount, setRunCount] = useState<number>(1);
  const [customStrategies, setCustomStrategies] = useState<StrategyOption[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);

  const toggleStrategy = (name: string) => {
    setSelectedStrategies(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleRun = () => {
    const allStrategies = [...AVAILABLE_STRATEGIES, ...customStrategies];
    const strategies = allStrategies
      .filter(s => selectedStrategies.has(s.name))
      .map(s => s.create());
    
    if (strategies.length < 2) {
      alert('Please select at least 2 strategies to run a simulation.');
      return;
    }
    
    if (runCount < 1 || runCount > 1000) {
      alert('Please enter a number between 1 and 1000 simulations.');
      return;
    }
    
    onRunSimulation(strategies, runCount);
  };

  const handleStrategyCreated = (strategy: IStrategy) => {
    const newStrategy: StrategyOption = {
      name: strategy.name,
      create: () => strategy,
      description: 'Custom user-created strategy',
    };
    setCustomStrategies([...customStrategies, newStrategy]);
    setSelectedStrategies(new Set([...selectedStrategies, strategy.name]));
    setShowBuilder(false);
  };

  const allStrategies = [...AVAILABLE_STRATEGIES, ...customStrategies];

  return (
    <>
      {showBuilder && (
        <>
          <div className="strategy-builder-overlay" onClick={() => setShowBuilder(false)} />
          <CustomStrategyBuilder
            onStrategyCreated={handleStrategyCreated}
            onCancel={() => setShowBuilder(false)}
          />
        </>
      )}
    
    <div className="strategy-picker">
      <h2>Select Strategies</h2>
      <p className="hint">Choose at least 2 strategies to compete</p>
      
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f0f4ff', borderRadius: '8px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Number of Simulations to Run:
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={runCount}
          onChange={(e) => setRunCount(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#666' }}>
          Running multiple simulations will show averaged results
        </p>
      </div>
      
      <div className="strategy-grid">
        {allStrategies.map(strategy => (
          <div
            key={strategy.name}
            className={`strategy-card ${selectedStrategies.has(strategy.name) ? 'selected' : ''} ${customStrategies.some(cs => cs.name === strategy.name) ? 'custom' : ''}`}
            onClick={() => toggleStrategy(strategy.name)}
          >
            <h3>{strategy.name}</h3>
            <p>{strategy.description}</p>
            <div className="checkbox">
              {selectedStrategies.has(strategy.name) ? '✓' : ''}
            </div>
            {customStrategies.some(cs => cs.name === strategy.name) && (
              <div className="custom-badge">Custom</div>
            )}
          </div>
        ))}
        
        <div
          className="strategy-card create-custom"
          onClick={() => setShowBuilder(true)}
        >
          <h3>+ Create Custom</h3>
          <p>Build your own strategy with custom rules and priorities</p>
        </div>
      </div>

      <button
        className="run-button"
        onClick={handleRun}
        disabled={isRunning || selectedStrategies.size < 2}
      >
        {isRunning 
          ? `Running... (${selectedStrategies.size} strategies × ${runCount} simulations)` 
          : `Run ${runCount} Simulation${runCount > 1 ? 's' : ''} (${selectedStrategies.size} strategies)`
        }
      </button>
      </div>
    </>
  );
}