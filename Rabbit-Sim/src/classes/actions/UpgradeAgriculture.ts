import type { IAction } from "./IAction.ts";
import  { type Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";

export class UpgradeAgriculture implements IAction {
    private _name : string = "UpgradeAgriculture";

    takeAction(actor: Colony): void {
        const level = actor.agriculture + 1;
        const cost = ColonyMath.upgradeCost(60, 1.33, level);
        if (actor.foodStorage >= cost) {
            actor.foodStorage -= cost;
            actor.agriculture = level;
            console.log(`${actor.name} upgraded Agriculture to ${level}.`);
        } else {
            console.log(`${actor.name} cannot afford Agriculture upgrade (needs ${cost}).`);
        }
    }

    get name(): string {
        return this._name;
    }
}