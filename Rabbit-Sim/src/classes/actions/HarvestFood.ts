import type { IAction } from "./IAction.ts";
import  { type Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

/**
 * Rabbits harvest food based on agriculture tech and population.
 * TODO possibilities: add spoilage! cbtm
 */
export class HarvestFood implements IAction {

    private _name : string = "HarvestFood";

    takeAction(actor: Colony): void {
        const agriLevel = actor.agriculture;
        const agriMult = ColonyMath.agricultureMultiplier(agriLevel);

        const baseFoodPerRabbit = 1;
        const foodProduced = actor.population * baseFoodPerRabbit * agriMult;
        const foodConsumed = actor.population; // each rabbit eats one food. Reasonable rabbits!

        const netGain = foodProduced - foodConsumed;

        // Update storage and energy, hell yeah
        actor.foodStorage += netGain;
        actor.energy = Math.max(0, actor.energy - 5);

        // Adjust unrest based on surplus or shortage, rabbits don't want to go hungry!!
        if (netGain < 0) {
            // hunger breeds unrest, break down of the colony from the inside??!?
            actor.unrest = ColonyMath.clamp(actor.unrest + 0.05, 0, 1);
        } else if (netGain > actor.population * 0.5) {
            // abundance calms the colony, bosh
            actor.unrest = ColonyMath.clamp(actor.unrest - 0.03, 0, 1);
        }

        const gained = Math.round(netGain);
        const prod = Math.round(foodProduced);
        const used = Math.round(foodConsumed);

        console.log(
            `${actor.name} harvested ${prod} food, consumed ${used}, net ${gained >= 0 ? "+" : ""}${gained}. `
            + `Energy: ${actor.energy.toFixed(1)}, Unrest: ${actor.unrest.toFixed(2)}.`
        );

        // Level 20 perk — “One with the Carrots”
        if (agriLevel >= 20) {
            actor.unrest = 0;
            console.log(`${actor.name} has transcended hunger. The carrots feed themselves.`);
        }
    }

    get name(): string {
        return this._name;
    }
}
