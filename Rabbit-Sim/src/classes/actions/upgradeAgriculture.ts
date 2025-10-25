import type { Colony } from "../Colony";
import type { Action } from "./Action";

export class upgradeAgriculture implements Action{
    takeAction(actor: Colony, target?: Colony, context?: any): void | Promise<void> {
        actor.agriculture *= 1.2;
    }
}