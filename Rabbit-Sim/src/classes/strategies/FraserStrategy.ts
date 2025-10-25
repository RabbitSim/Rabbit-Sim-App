import type { IStrategy } from "./IStrategy.ts";
import type { ActionNameKey } from "../actions/ActionName.ts";
import type {ColonyMetrics} from "../ColonyMetrics.ts";

export class FraserStrategy implements IStrategy {

    getWeights(_metrics: ColonyMetrics): Record<ActionNameKey, number> {

        return { // Should sum to 100
            Attack: 5,
            Eat: 15,
            Sleep: 50,
            UPGRADE_AGRICULTURE: 0,
            UPGRADE_DEFENCE: 0,
            UPGRADE_OFFENSE: 0,
            HARVEST_FOOD: 30,
            MEDITATE: 0,
        };
    }
}