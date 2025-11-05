import type { IStrategy } from './IStrategy';
import type { ActionNameKey } from '../actions/ActionName';
import type { ColonyMetrics } from '../ColonyMetrics';

export interface ActionWeight {
  action: ActionNameKey;
  baseWeight: number; // 0-10, higher = more likely
  conditions?: {
    minFood?: number;
    maxFood?: number;
    minPopulation?: number;
    maxPopulation?: number;
    minEnergy?: number;
    maxEnergy?: number;
    isDay?: boolean;
    isNight?: boolean;
  };
}

export interface CustomStrategyConfig {
  name: string;
  actionWeights: ActionWeight[];
}

export class CustomStrategy implements IStrategy {
  private config: CustomStrategyConfig;

  constructor(config: CustomStrategyConfig) {
    this.config = config;
  }

  get name(): string {
    return this.config.name || 'CustomStrategy';
  }

  getWeights(metrics: ColonyMetrics): Record<ActionNameKey, number> {
    // Initialize all weights to 0
    const weights: Record<string, number> = {
      Attack: 0,
      Eat: 0,
      Sleep: 0,
      UPGRADE_AGRICULTURE: 0,
      UPGRADE_DEFENCE: 0,
      UPGRADE_OFFENSE: 0,
      HARVEST_FOOD: 0,
      MEDITATE: 0,
    };

    // Apply configured weights based on conditions
    for (const aw of this.config.actionWeights) {
      let weight = aw.baseWeight;

      // Check conditions and modify weight
      if (aw.conditions) {
        const cond = aw.conditions;
        
        if (cond.minFood !== undefined && metrics.foodStorage < cond.minFood) weight = 0;
        if (cond.maxFood !== undefined && metrics.foodStorage > cond.maxFood) weight = 0;
        if (cond.minPopulation !== undefined && metrics.population < cond.minPopulation) weight = 0;
        if (cond.maxPopulation !== undefined && metrics.population > cond.maxPopulation) weight = 0;
        if (cond.minEnergy !== undefined && metrics.energy < cond.minEnergy) weight = 0;
        if (cond.maxEnergy !== undefined && metrics.energy > cond.maxEnergy) weight = 0;
        // Note: isDay/isNight conditions not supported as ColonyMetrics doesn't include time info
        // These would need to be handled at a higher level if needed
      }

      weights[aw.action] = Math.max(weights[aw.action], weight);
    }

    return weights as Record<ActionNameKey, number>;
  }
}
