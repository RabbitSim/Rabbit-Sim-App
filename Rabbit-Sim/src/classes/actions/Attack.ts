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

    takeAction(actor: Colony, target?: Colony, isDay?: boolean): void {
        if (!target) return;

        //Core effective stats
        let oEff = actor.offence * ColonyMath.offenceMultiplier(actor.offence);
        let dEff = target.defence * ColonyMath.defenceMultiplier(target.defence);

        if (isDay) {
            dEff *= 1.25;
            console.log(`${target.name} is fortified by daylight - defenders gain +25% defence.`);
        } else {
            oEff *= 1.25;
            console.log(`${actor.name} launches a night raid under cover of darkness! (+25% attack power)`);
        }

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
            // attacker advantage
            const damage = Math.round(actor.population * 0.18 * power * critMult); // was 0.1
            targetLoss = damage;
            target.population = Math.max(0, target.population - damage);

            // Loot some food as spoils of war
            const loot = Math.round(target.foodStorage * 0.25 * Math.random()); // up to 25%
            target.foodStorage = Math.max(0, target.foodStorage - loot);
            actor.foodStorage += loot;

            log = `${actor.name} overwhelms ${target.name}, killing ${damage} rabbits and looting ${loot} food!`;
            if (critHit) log += " (Critical strike!)";

        } else if (power > 0.7) {
            // Near-even fight
            const damage = Math.round(actor.population * 0.08 * (0.8 + Math.random() * 0.4)); // was 0.05
            targetLoss = damage;
            actorLoss = Math.round(damage * (0.6 + Math.random() * 0.4)); // was 0.4–0.8 ratio
            target.population = Math.max(0, target.population - targetLoss);
            actor.population = Math.max(0, actor.population - actorLoss);

            // shared unrest spike
            actor.unrest = ColonyMath.clamp(actor.unrest + 0.05, 0, 1);
            target.unrest = ColonyMath.clamp(target.unrest + 0.05, 0, 1);

            log = `${actor.name} fought ${target.name} to a brutal draw. ${actorLoss} attackers and ${targetLoss} defenders perished.`;

        } else {
            // Defender advantage
            const damage = Math.round(actor.population * 0.12 * (0.8 + Math.random() * 0.5)); // was 0.07
            actorLoss = damage;
            actor.population = Math.max(0, actor.population - damage);

            // morale collapse chance
            if (Math.random() < 0.25) {
                actor.unrest = ColonyMath.clamp(actor.unrest + 0.1, 0, 1);
                log = `${actor.name} failed to breach ${target.name}’s defences, losing ${damage} soldiers. Panic spreads through the ranks!`;
            } else {
                log = `${actor.name} failed to breach ${target.name}’s defences and lost ${damage} soldiers.`;
            }

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
