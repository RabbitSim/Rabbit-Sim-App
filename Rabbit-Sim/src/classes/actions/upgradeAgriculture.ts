import type { Action } from "./Action";
import type { Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

export class UpgradeAgriculture implements Action {
    takeAction(actor: Colony): void {
        const level = actor.agriculture + 1;
        const cost = ColonyMath.upgradeCost(60, 1.33, level);
        if (actor.foodStorage >= cost) {
            actor.foodStorage -= cost;
            actor.agriculture = level;
            console.log(`${actor.name} upgraded Agriculture to ${level}.`);
        } else {
            console.log(`${actor.name} cannot afford Agriculture upgrade (needs ${cost}).`);
        }
    }
}
