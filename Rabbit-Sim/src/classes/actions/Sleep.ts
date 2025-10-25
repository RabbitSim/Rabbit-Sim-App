import type { Action } from "./Action";
import { Colony } from "../Colony";

export class Sleep implements Action {
    takeAction(actor: Colony): number {
        actor.population *= 1.2;
        actor.energy *= 1.2;
        return 1;
    }
}