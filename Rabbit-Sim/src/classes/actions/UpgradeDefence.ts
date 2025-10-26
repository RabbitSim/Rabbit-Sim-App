import type { IAction } from "./IAction.ts";
import  { type Colony } from "../Colony";
import { ColonyMath } from "../math/ColonyMath";
import * as console from "node:console";
import * as console from "node:console";

export class UpgradeDefence implements IAction{
    private _name : string = "UpgradeDefence";
    takeAction(actor: Colony, target?: Colony, context?: any): void | Promise<void> {
        const level = actor.defence + 1;
        const cost = ColonyMath.upgradeCost(60, 1.33, level);
        if (actor.foodStorage >= cost) {
            actor.foodStorage -= cost;
            actor.defence = level;
            console.log(`${actor.name} upgraded Defence to ${level}.`);
        } else {
            console.log(`${actor.name} cannot afford Defence upgrade (needs ${cost}).`);
        }
    }

    get name(): string {
        return this._name;
    }
}