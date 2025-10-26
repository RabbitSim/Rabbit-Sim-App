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
            UPGRADE_AGRICULTURE: 5,
            UPGRADE_DEFENCE: 5,
            UPGRADE_OFFENSE: 40,
            HARVEST_FOOD: 20,
            MEDITATE: 5,
        };
    }


}