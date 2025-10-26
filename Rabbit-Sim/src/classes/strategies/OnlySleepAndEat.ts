import type { IStrategy } from "./IStrategy.ts";
import type { ActionNameKey } from "../actions/ActionName.ts";
import type {ColonyMetrics} from "../ColonyMetrics.ts";

export class OnlySleepAndEat implements IStrategy {

    getWeights(_metrics: ColonyMetrics): Record<ActionNameKey, number> {

        return { // Should sum to 100
            Attack: 0,
            Eat: 50,
            Sleep: 50,
            UPGRADE_AGRICULTURE: 0,
            UPGRADE_DEFENCE: 0,
            UPGRADE_OFFENSE: 0,
            HARVEST_FOOD: 0,
            MEDITATE: 0
        };
    }
}