import type { IStrategy } from "./IStrategy";
import type { ActionNameKey } from "../actions/ActionName";
import type { ColonyMetrics } from "../ColonyMetrics";

export class DefensiveStrategy implements IStrategy {

    name: string = "DefensiveStrategy";
    getWeights(_metrics: ColonyMetrics): Record<ActionNameKey, number> {
        return {
            Attack: 0,
            Eat: 20,
            Sleep: 30,
            UPGRADE_AGRICULTURE: 10,
            UPGRADE_DEFENCE: 30,
            UPGRADE_OFFENSE: 0,
            HARVEST_FOOD: 10,
            MEDITATE: 0,
        };
    }
}