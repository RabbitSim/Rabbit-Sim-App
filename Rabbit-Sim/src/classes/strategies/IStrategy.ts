import type {ActionNameKey} from "../actions/ActionName.ts";
import type {ColonyMetrics} from "../ColonyMetrics.ts";


export interface IStrategy {
    getWeights(metrics: ColonyMetrics): Record<ActionNameKey, number>;
}