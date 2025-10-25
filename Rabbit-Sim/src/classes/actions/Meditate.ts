import type { Action } from "./Action";
import type { Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

// you want your rabbits mentally stable
export class Meditate implements Action {
    takeAction(actor: Colony): void {
        const defenceLevel = actor.defence;
        const moraleBoost = 0.1 + 0.02 * defenceLevel;
        actor.unrest = ColonyMath.clamp(actor.unrest - moraleBoost, 0, 1);
        console.log(`${actor.name} meditated. Unrest reduced by ${moraleBoost.toFixed(2)}.`);
    }
}
