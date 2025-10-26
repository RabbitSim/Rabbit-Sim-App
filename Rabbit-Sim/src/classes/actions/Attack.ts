import type { IAction } from "./IAction.ts";
import type { Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

export class Attack implements IAction {

    public name : string = "Attack";

    takeAction(actor: Colony, target?: Colony): void {
        if (!target) return;
        const oEff = actor.offence * ColonyMath.offenceMultiplier(actor.offence);
        const dEff = target.defence * ColonyMath.defenceMultiplier(target.defence);
        const power = oEff / (dEff + 1);

        if (power > 1.2) {
            const damage = Math.round(actor.population * 0.1 * power);
            target.population = Math.max(0, target.population - damage);
            console.log(`${actor.name} overwhelms ${target.name}, killing ${damage} rabbits!`);
        } else if (power > 0.8) {
            const damage = Math.round(actor.population * 0.05);
            target.population -= damage;
            actor.population -= Math.round(damage * 0.6);
            console.log(`${actor.name} fought ${target.name} to a bloody draw.`);
        } else {
            const damage = Math.round(actor.population * 0.08);
            actor.population -= damage;
            console.log(`${actor.name} failed to breach ${target.name}’s defences and lost ${damage} soldiers.`);
        }

        actor.energy = Math.max(0, actor.energy - 10);
    }
}
