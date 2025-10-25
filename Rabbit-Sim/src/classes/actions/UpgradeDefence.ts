import type { Action } from "./Action";
import type { Colony } from "../Colony";

export class UpgradeDefence implements Action{
    takeAction(actor: Colony, target?: Colony, context?: any): void | Promise<void> {
        actor.defence++;
    }
}