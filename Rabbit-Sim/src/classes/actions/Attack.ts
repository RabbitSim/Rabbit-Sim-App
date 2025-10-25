import type { Action } from './Action';
import { Colony } from '../Colony';

export class Attack implements Action {
    readonly name = 'Attack';

    takeAction(actor: Colony, target?: Colony, context?: any): void {
        if (!target) {
            context?.log?.(`${actor.name} attempted an attack but no target was provided.`);
            return;
        }
        if (actor === target) {
            context?.log?.(`${actor.name} cannot attack itself.`);
            return;
        }
        if (actor.isDefeated) {
            context?.log?.(`${actor.name} is defeated and cannot attack.`);
            return;
        }
        if (target.isDefeated) {
            context?.log?.(`${target.name} is already defeated.`);
            return;
        }

        const atkPop = actor.population;
        const defPop = target.population;
        const atkMil = actor.offence;
        const defMil = target.defence;

        if (atkPop <= 0 || atkMil <= 0) {
            context?.log?.(`${actor.name} has no effective fighting force and the attack fails.`);
            return;
        }

        // Simple combat model: military is weighted more than population.
        const atkPower = atkMil * 2 + atkPop;
        const defPower = defMil * 2 + defPop;
        const totalPower = atkPower + defPower;

        // Fraction of population that can be lost in a single battle (tuneable)
        const MAX_LOSS_FRACTION = 0.5;

        // Casualties scaled by relative power and by max loss fraction
        const targetCasualties = Math.min(
            defPop,
            Math.floor((atkPower / totalPower) * MAX_LOSS_FRACTION * defPop)
        );

        const actorCasualties = Math.min(
            atkPop,
            Math.floor((defPower / totalPower) * MAX_LOSS_FRACTION * atkPop * 0.6) // attackers typically suffer less
        );

        // Apply population losses
        const newTargetPop = Math.max(0, defPop - targetCasualties);
        const newActorPop = Math.max(0, atkPop - actorCasualties);

        // Reduce military proportionally to population losses (simple approximation)
        const targetMilLost = defPop > 0 ? Math.min(defMil, Math.round(defMil * (targetCasualties / defPop))) : 0;
        const actorMilLost = atkPop > 0 ? Math.min(atkMil, Math.round(atkMil * (actorCasualties / atkPop))) : 0;

        actor.population = newActorPop;
        target.population = newTargetPop;
        actor.offence = Math.max(0, atkMil - actorMilLost);
        target.defence = Math.max(0, defMil - targetMilLost);

        if (actor.population === 0) actor.isDefeated = true;
        if (target.population === 0) target.isDefeated = true;

        context?.log?.(
            `${actor.name} attacked ${target.name}: attacker lost ${actorCasualties} pop, defender lost ${targetCasualties} pop.`
        );
        context?.log?.(
            `${actor.name} -> pop:${actor.population} off:${actor.offence}; ${target.name} -> pop:${target.population} def:${target.defence}`
        );
    }
}
