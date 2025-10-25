import type { IAction } from "./IAction.ts";
import { Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

export class Sleep implements IAction {
    takeAction(actor: Colony, target?: Colony, context?: any): void {
        actor.energy = Math.min(actor.energy * 1.2, 100);
        //rabbits look ahead at their food storage to limit how many rabbits they can feasibly support
        //this is doing rate of growth = 0.04 * popluation  * (1 - population / foodStorage)
        //logistic growth model popping off here
        actor.population += ColonyMath.populationGrowth(actor.population, 0.04, actor.foodStorage * 2);
        console.log(`${actor.name} is sleeping. Energy restored to ${actor.energy.toFixed(2)}. Population is now ${actor.population}.`);
    }
}