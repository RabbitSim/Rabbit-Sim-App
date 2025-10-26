import type { IStrategy } from "./IStrategy";
import type { ActionNameKey } from "../actions/ActionName";
import type { ColonyMetrics } from "../ColonyMetrics";

export class PacifistStrategy implements IStrategy {
    getWeights(_metrics: ColonyMetrics): Record<ActionNameKey, number> {
        return {
            Attack: 0,
            Eat: 20,
            Sleep: 30,
            UPGRADE_AGRICULTURE: 10,
            UPGRADE_DEFENCE: 0,
            UPGRADE_OFFENSE: 0,
            HARVEST_FOOD: 20,
            MEDITATE: 20,
        };
    }
}