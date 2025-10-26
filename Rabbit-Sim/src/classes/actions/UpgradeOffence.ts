import type { IAction } from "./IAction.ts";
import  { type Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

export class UpgradeOffence implements IAction{
    private _name : string = "UpgradeOffence";
    takeAction(actor: Colony, target?: Colony, context?: any): void | Promise<void> {
        const level = actor.offence + 1;
        const cost = ColonyMath.upgradeCost(60, 1.33, level);
        if (actor.foodStorage >= cost) {
            actor.foodStorage -= cost;
            actor.offence = level;
            console.log(`${actor.name} upgraded Offence to ${level}.`);
        } else {
            console.log(`${actor.name} cannot afford Offence upgrade (needs ${cost}).`);
        }
    }

    get name(): string {
        return this._name;
    }
}
