import type { Action } from './Action';
import { Colony } from '../Colony';

export class Eat implements Action {
    readonly name = 'Eat';

    takeAction(actor: Colony, target?: Colony, context?: any): void {
        const food = actor.foodStorage;
        const population = actor.population;

        if (food <= 0) {
            actor.foodStorage = 0;
            actor.population = 0;
            actor.isDefeated = true;
            context?.log?.(`${actor.name} had no food and collapsed.`);
            return;
        }

        const consumed = Math.min(population, food);
        actor.foodStorage = food - consumed;
        const unfed = population - consumed;

        if (unfed > 0) {
            actor.population = Math.max(0, population - unfed);
            if (actor.population === 0) actor.isDefeated = true;
            context?.log?.(`${actor.name} lost ${unfed} to starvation.`);
        }
    }
}