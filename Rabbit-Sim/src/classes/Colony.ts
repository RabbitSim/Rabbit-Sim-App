import type {IAction} from './actions/IAction.ts'
import type {IStrategy} from "./strategies/IStrategy.ts";
import {ColonyMetrics} from "./ColonyMetrics.ts";
import type {ActionNameKey} from "./actions/ActionName.ts";
import {Attack} from "./actions/Attack.ts";
import {Eat} from "./actions/Eat.ts";
import {Sleep} from "./actions/Sleep.ts";
import {UpgradeAgriculture} from "./actions/UpgradeAgriculture.ts";
import {UpgradeDefence} from "./actions/UpgradeDefence.ts";
import {UpgradeOffence} from "./actions/UpgradeOffence.ts";
import {HarvestFood} from "./actions/HarvestFood.ts";
import {Meditate} from "./actions/Meditate.ts";
import { ColonyMath } from './math/ColonyMath.ts';

import weightedRandomObject from "weighted-random-object";


import type {ColonyState} from "./logger/helperInterfaces.ts";

export class Colony {
    private static id: number = 0;

    private _id: number = Colony.id++;
    private _name: string;
    private _population: number;
    private _agriculture: number;
    private _offence: number;
    private _energy: number;
    private _unrest: number;
    private _isDefeated: boolean = false;
    private _foodStorage: number;
    private _relationships: Map<Colony, number> = new Map();
    private _defence: number;
    private _strategy: IStrategy;

    private _nextAction: IAction | null = null;

    constructor(name: string, population: number, agriculture: number,
    offence: number, energy: number, morale: number, foodStorage: number, defence: number, strategy:IStrategy) {
        // Attributes of each colony
        this._name = name;
        this._population = population;
        this._agriculture = agriculture;
        this._offence = offence;
        this._energy = energy;
        this._unrest = morale;
        this._foodStorage = foodStorage;
        this._defence = defence;
        this._strategy = strategy;
    }

    public takeAction(isDay: boolean, allColonies?: Colony[]): IAction {

        this._nextAction = this.chooseAction();
        if (this._nextAction instanceof Attack) {
            if (!allColonies || allColonies.length <= 1) {
                console.warn(`${this.name} wanted to attack, but found no valid targets.`);
                return this._nextAction;
            }

            const potentialTargets = allColonies.filter(c => c !== this && !c.isDefeated);
            if (potentialTargets.length > 0) {
                const target = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
                console.log(`${this.name} attacks ${target.name}!`);
                this._nextAction.takeAction(this, target, isDay);
            } else {
                console.log(`${this.name} wanted to attack, but all enemies are dead.`);
            }
        } 
        else {
            // Normal non-attack actions
            this._nextAction.takeAction(this, undefined, isDay);
        }

    return this._nextAction;
    }
    private createActionByKey(key: ActionNameKey): IAction {
        switch (key) {
            case "Attack": return new Attack();
            case "Eat": return new Eat();
            case "Sleep": return new Sleep();
            case "UPGRADE_AGRICULTURE": return new UpgradeAgriculture();
            case "UPGRADE_DEFENCE": return new UpgradeDefence();
            case "UPGRADE_OFFENSE": return new UpgradeOffence();
            case "HARVEST_FOOD": return new HarvestFood();
            case "MEDITATE": return new Meditate();
            default:
                throw new Error(`Unknown action key: ${key}`);
        }
    }

    private chooseAction(): IAction {
        const metrics = this.createMetrics();
        const baseWeights = this._strategy.getWeights(metrics);

        // Copy base weight
        const weights: Record<ActionNameKey, number> = { ...baseWeights };

        const foodRatio = this.foodStorage / Math.max(1, this.population);
        const energy = this.energy;
        const unrest = this.unrest;

        // --- Dynamic multipliers ---
        for (const key in weights) {
            const k = key as ActionNameKey;
            let multiplier = 1;

            //STARVATION — crank up harvest/eat, dial down war
             if (this.foodStorage <= 0) {
                // colony has no food at all
                if (k === "HARVEST_FOOD") multiplier *= 10; // ultra priority
                if (k === "Eat") multiplier *= 0.1;         // pointless when no food
                if (k.startsWith("UPGRADE_") || k === "Attack") multiplier *= 0.2;
                if (k === "Sleep") multiplier *= 0.5;
                if (k === "MEDITATE") multiplier *= 0.3;
            } 
            else if (foodRatio < 0.5) {
                if (k === "HARVEST_FOOD") multiplier *= 3;
                if (k === "Eat") multiplier *= 2;
                if (k === "Attack") multiplier *= 0.5;
            } else if (foodRatio < 1.0) {
                if (k === "HARVEST_FOOD") multiplier *= 1.8;
            }

            //LOW ENERGY — rabbits prefer sleep
            if (energy < 30) {
                if (k === "Sleep") multiplier *= 3;
                if (k === "Attack" || k.startsWith("UPGRADE_")) multiplier *= 0.5;
            } else if (energy < 60) {
                if (k === "Sleep") multiplier *= 1.5;
            }// don't need that honk sho me me me me ... no more
            if (energy > 90) {
                if (k === "Sleep") multiplier *= 0.2;
            }
            // total mental breakdown iminant
            if (unrest > 0.9) {
                if (k === "MEDITATE") multiplier *= 4;
                if (k === "HARVEST_FOOD" || k === "UPGRADE_AGRICULTURE") multiplier *= 5;
                if (k === "Attack" || k.startsWith("UPGRADE_")) multiplier *= 0.2;
            }

            //meditation is kinda needed man
            if (unrest > 0.7) {
                if (k === "MEDITATE") multiplier *= 2.5;
                if (k === "Attack") multiplier *= 0.6;
                if (k === "HARVEST_FOOD") multiplier *= 3;     // panic farming
                if (k === "UPGRADE_AGRICULTURE") multiplier *= 2; // long-term food fix
                if (k === "Eat") multiplier *= 1.5;            // stress-eating
                if (k === "Attack") multiplier *= 0.5;
                if (k.startsWith("UPGRADE_") && k !== "UPGRADE_AGRICULTURE") multiplier *= 0.7;
            }

            //we have enough food lets spend some — more willingness to upgrade or attack
            if (foodRatio > 2 && energy > 60 && unrest < 0.5) {
                if (k.startsWith("UPGRADE_") || k === "Attack") multiplier *= 1.5;
                if (k === "HARVEST_FOOD") multiplier *= 0.5;
            }
            weights[k] = Math.max(0, weights[k] * multiplier);
        }

        //If everything got squashed to zero somehow, fall back to base weights
        //i don't think this is possible due to it just being multipliers but better safe than sorry
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        const finalWeights = totalWeight > 0 ? weights : baseWeights;

        // --- Weighted random selection ---
        const options = Object.entries(finalWeights)
            .filter(([_, w]) => w > 0)
            .map(([key, weight]) => ({
                action: this.createActionByKey(key as ActionNameKey),
                weight
            }));

        const chosen = weightedRandomObject(options) as { key: ActionNameKey; action: IAction; weight: number };

    // if they can't afford what they want to do then they will head to the farm instead in hopes of a brighter future
    const upgradeKeys = ["UPGRADE_AGRICULTURE", "UPGRADE_DEFENCE", "UPGRADE_OFFENSE"];
    if (upgradeKeys.includes(chosen.key)) {
        const costMap: Record<string, number> = {
            UPGRADE_AGRICULTURE: ColonyMath.upgradeCost(100, 1.2, this.agriculture),
            UPGRADE_DEFENCE: ColonyMath.upgradeCost(120, 1.25, this.defence),
            UPGRADE_OFFENSE: ColonyMath.upgradeCost(140, 1.3, this.offence),
        };

        const cost = costMap[chosen.key];

        if (this.foodStorage < cost) {
            console.log(
                `${this.name} wanted to upgrade (${chosen.key}) but couldn't afford ${cost} food. Switching to HarvestFood instead.`
            );
            return new HarvestFood();
        }
    }

    return chosen.action;
    }

    private createMetrics(): ColonyMetrics {
        return new ColonyMetrics(this.population, this.agriculture, this.offence,
            this.energy, this.unrest, this.foodStorage, this.relationships, this.defence,
            this.isDefeated);
    }

    public toJSON(): ColonyState {
        return {
            id: this.id,
            name: this.name,
            population: this.population,
            food: this.foodStorage,
            energy: this.energy,
            defense: this.defence,
            offense: this.offence,
            agriculture: this.agriculture,
            isDefeated: this.isDefeated,
            strategy: this.strategy.name,
        };
    }

    public modifyRelationship(otherColony: Colony, amount: number): void {
        const currentRelationship = this._relationships.get(otherColony) ?? 0;
        const newRelationship = currentRelationship + amount;
        this._relationships.set(otherColony, ColonyMath.clamp(newRelationship, -100, 100));
    }

    // Getters & Setters

    get isDefeated(): boolean {
        return this._isDefeated;
    }

    set isDefeated(value: boolean) {
        this._isDefeated = value;
    }

    get nextAction(): IAction | null {
        return this._nextAction;
    }

    set nextAction(value: IAction | null) {
        this._nextAction = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get population(): number {
        return this._population;
    }

    set population(value: number) {
        this._population = value;
    }

    get agriculture(): number {
        return this._agriculture;
    }

    set agriculture(value: number) {
        this._agriculture = value;
    }

    get offence(): number {
        return this._offence;
    }

    set offence(value: number) {
        this._offence = value;
    }

    set military(value: number) {
        this._offence = value;
    }

    get energy(): number {
        return this._energy;
    }

    set energy(value: number) {
        this._energy = value;
    }

    get unrest(): number {
        return this._unrest;
    }

    set unrest(value: number) {
        this._unrest = value;
    }

    get foodStorage(): number {
        return this._foodStorage;
    }

    set foodStorage(value: number) {
        this._foodStorage = value;
    }

    get relationships(): Map<Colony, number> {
        return this._relationships;
    }

    set relationships(value: Map<Colony, number>) {
        this._relationships = value;
    }

    get defence(): number {
        return this._defence;
    }

    set defence(value: number) {
        this._defence = value;
    }

    get strategy(): IStrategy {
        return this._strategy;
    }

    set strategy(value: IStrategy) {
        this._strategy = value;
    }

    get id(): number {
        return this._id;
    }
}