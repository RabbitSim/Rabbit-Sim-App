import type { IStrategy } from "./IStrategy";
import type { ActionNameKey } from "../actions/ActionName";
import type { ColonyMetrics } from "../ColonyMetrics";

export class AggressiveStrategy implements IStrategy {

    name: string = "AggressiveStrategy";
    getWeights(_metrics: ColonyMetrics): Record<ActionNameKey, number> {
        return {
            Attack: 40,
            Eat: 20,
            Sleep: 10,
            UPGRADE_AGRICULTURE: 0,
            UPGRADE_DEFENCE: 0,
            UPGRADE_OFFENSE: 20,
            HARVEST_FOOD: 10,
            MEDITATE: 0,
        };
    }


}