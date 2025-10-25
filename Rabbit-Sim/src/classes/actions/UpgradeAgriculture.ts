import type { Colony } from "../Colony";
import type { Action } from "./Action";

export class UpgradeAgriculture implements Action{
    takeAction(actor: Colony, target?: Colony, context?: any): void | Promise<void> {
        actor.agriculture++;
    }
}