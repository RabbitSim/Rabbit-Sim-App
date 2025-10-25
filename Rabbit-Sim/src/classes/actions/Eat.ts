import type { Action } from './Action';
import { Colony } from '../Colony';

export class Eat implements Action {
    readonly name = 'Eat';


    // colony eats one food per rabbit
    // if there isn't enough food return the number of unfed rabbits
    takeAction(actor: Colony): number{
        const current = actor.foodStorage;
        const population = actor.population;
        if (current <= 0) return population;
        const consumed = Math.min(population, current);
        actor.foodStorage = current - consumed;
        const unfed = population - consumed;
        return unfed;
    }

}