import type { Action } from "./Action";
import { Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

export class Sleep implements Action {
    takeAction(actor: Colony, target?: Colony, context?: any): void {
        actor.energy = Math.min(actor.energy * 1.2, 100);
        actor.population += ColonyMath.populationGrowth(actor.population, 0.04, actor.foodStorage * 2);
        console.log(`${actor.name} is sleeping. Energy restored to ${actor.energy.toFixed(2)}. Population is now ${actor.population}.`);
    }
}