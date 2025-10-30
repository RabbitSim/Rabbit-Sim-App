import type { IAction } from "./IAction.ts";
import { Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

export class Sleep implements IAction {
    private _name : string = "Sleep";

    takeAction(actor: Colony, target?: Colony, context?: any): void {
        // Rabbits rest and recover energy.
        actor.energy = Math.min(actor.energy * 1.2, 100);
        //rabbits look ahead at their food storage to limit how many rabbits they can feasibly support
        //K = carrying capacity:
        //Primarily based on available foodStorage * 2 (their sustainable limit)
        //Never less than 20–50% of current population, scaled by energy (tired colonies breed less)
        //Never below 1 (to avoid mathematical extinction which is kinda bad)


        //this is doing rate of growth = 0.04 * popluation  * (1 - population / K)
        //logistic growth model popping off here
        const K = Math.max(1, actor.foodStorage * 2, actor.population * (0.2 + actor.energy / 100 * 0.3));
        const growth = ColonyMath.populationGrowth(actor.population, 0.04, K);
        actor.population += growth;
        if (!isFinite(actor.population) || actor.population < 0) {
            console.warn(`${actor.name} had invalid population value (${actor.population}). Resetting to 0.`);
            actor.population = 0;
        }
        console.log(`${actor.name} is sleeping. Energy restored to ${actor.energy.toFixed(2)}. Population is now ${actor.population}.`);
    }

    get name(): string {
        return this._name;
    }
}