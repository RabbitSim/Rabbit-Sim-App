import type { IAction } from "./IAction";
import type { Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

/**
 * Aye. Fight and you may die. Run, and you’ll live...at least a while. And dying in your
 * beds, many years from now, would you be willing to trade all the days, from this day to that, for one
 * chance – just one chance – to come back here and tell our enemies that they may take our lives 
 * but they’ll never take our freedom!!!
 */
export class Attack implements IAction {

    public name : string = "Attack";

    takeAction(actor: Colony, target?: Colony): void {
        if (!target) return;

        //Core effective stats
        const oEff = actor.offence * ColonyMath.offenceMultiplier(actor.offence);
        const dEff = target.defence * ColonyMath.defenceMultiplier(target.defence);

        //Random variance: +_15% swing in both offence and defence
        //Sometimes Maybe Good, Sometimes Maybe Shit
        const variance = () => 0.85 + Math.random() * 0.3;
        const oVar = oEff * variance();
        const dVar = dEff * variance();

        //Morale modifier: higher unrest lowers effectiveness
        const moraleBonus = (1 - actor.unrest) - (1 - target.unrest) * 0.2;
        const power = (oVar / (dVar + 1)) * (1 + moraleBonus * 0.2);

        //Critical chance for upsets
        const critChance = Math.min(0.05 + (actor.offence / 100), 0.25); // cap at 25%
        const critHit = Math.random() < critChance;
        const critMult = critHit ? 1.8 : 1.0;

        //roll for “heroic resistance” — 10% base chance for defender to flip outcome
        const upsetRoll = Math.random();
        const upsetThreshold = 0.1 + target.unrest * 0.1; //calmer colonies resist better
        const upset = upsetRoll < upsetThreshold;

        let log = "";
        let actorLoss = 0;
        let targetLoss = 0;

        if (power * (upset ? 0.7 : 1.0) > 1.1) {
            // Attacker advantage
            const damage = Math.round(actor.population * 0.1 * power * critMult);
            targetLoss = damage;
            target.population = Math.max(0, target.population - damage);
            log = `${actor.name} overwhelms ${target.name}, killing ${damage} rabbits!`;
            if (critHit) log += " (Critical strike!)";
        } else if (power > 0.7) {
            // Near-even fight
            const damage = Math.round(actor.population * 0.05 * (0.8 + Math.random() * 0.4));
            targetLoss = damage;
            actorLoss = Math.round(damage * (0.4 + Math.random() * 0.4));
            target.population = Math.max(0, target.population - targetLoss);
            actor.population = Math.max(0, actor.population - actorLoss);
            log = `${actor.name} fought ${target.name} to a chaotic draw. (${actorLoss} vs ${targetLoss} lost)`;
        } else {
            // Defender advantage
            const damage = Math.round(actor.population * 0.07 * (0.8 + Math.random() * 0.5));
            actorLoss = damage;
            actor.population = Math.max(0, actor.population - damage);
            log = `${actor.name} failed to breach ${target.name}’s defences and lost ${damage} soldiers.`;
            if (upset) log += " The defenders rallied heroically!";
        }

        // Energy drain
        //gotta get that sleep cover
        actor.energy = Math.max(0, actor.energy - (8 + Math.random() * 5));

        // Morale adjustment
        // maybe this fighting stuff isn't for me
        if (targetLoss > actorLoss) {
            actor.unrest = ColonyMath.clamp(actor.unrest - 0.05, 0, 1);
            target.unrest = ColonyMath.clamp(target.unrest + 0.05, 0, 1);
        } else {
            actor.unrest = ColonyMath.clamp(actor.unrest + 0.03, 0, 1);
            target.unrest = ColonyMath.clamp(target.unrest - 0.02, 0, 1);
        }
        console.log(log);
    }
}
