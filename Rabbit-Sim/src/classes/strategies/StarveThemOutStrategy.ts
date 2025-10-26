import type { IStrategy } from "./IStrategy";
import type { ActionNameKey } from "../actions/ActionName";
import type { ColonyMetrics } from "../ColonyMetrics";

export class StarveThemOutStrategy implements IStrategy {

    name: string = "StarveThemOutStrategy";
    getWeights(_metrics: ColonyMetrics): Record<ActionNameKey, number> {
        return {
            Attack: 0,
            Eat: 25,
            Sleep: 0,
            UPGRADE_AGRICULTURE: 50,
            UPGRADE_DEFENCE: 0,
            UPGRADE_OFFENSE: 0,
            HARVEST_FOOD: 25,
            MEDITATE: 0,
        };
    }
}