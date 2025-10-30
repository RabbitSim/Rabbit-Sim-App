import type { IAction } from './IAction.ts';
import { Colony } from '../Colony';

export class Eat implements IAction {
    name = 'Eat';

    takeAction(actor: Colony, target?: Colony, context?: any): void {
        const food = actor.foodStorage;
        const population = actor.population;

        console.log("Eating");

        if (food <= 0) {
            const lossPercent = 0.5 + Math.random() * 0.3; // lose 50–80%
            let survivors = population * (1 - lossPercent);

            // If already critically low, finish them off
            if (survivors < 5) {
                actor.population = 0;
                console.log(`${actor.name} has completely starved to death.`);
            } else {
                actor.population = survivors;
                actor.energy = Math.max(10, actor.energy * 0.5);
                actor.unrest = Math.min(1, actor.unrest + 0.25);
                actor.foodStorage = 0;
                console.log(`${actor.name} starved! Lost ${(lossPercent * 100).toFixed(0)}% of population.`);
            }
            return;
        }

        const consumed = Math.min(population, food);
        actor.foodStorage = food - consumed;
        const unfed = population - consumed;

        if (unfed > 0) {
            const lossPercent = Math.min(0.3, unfed / population);
            let survivors = Math.max(1, population * (1 - lossPercent));
            if (survivors < 5) {
                survivors = 0;
                console.log(`${actor.name} has perished from underfeeding.`);
            }
            else{
            actor.population = survivors;
            actor.unrest = Math.min(1, actor.unrest + 0.1);
            console.log(`${actor.name} was underfed — lost ${(lossPercent * 100).toFixed(0)}% pop.`);
            }
        }   
    }
}