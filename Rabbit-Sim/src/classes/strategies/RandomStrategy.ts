import type { IStrategy } from "./IStrategy";
import type { ActionNameKey } from "../actions/ActionName";
import type { ColonyMetrics } from "../ColonyMetrics";

export class RandomStrategy implements IStrategy {

    name: string = "RandomStrategy";
    getWeights(_metrics: ColonyMetrics): Record<ActionNameKey, number> {
        return {
            Attack: 12.5,
            Eat: 12.5,
            Sleep: 12.5,
            UPGRADE_AGRICULTURE: 12.5,
            UPGRADE_DEFENCE: 12.5,
            UPGRADE_OFFENSE: 12.5,
            HARVEST_FOOD: 12.5,
            MEDITATE: 12.5,
        };
    }
}