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

    public takeAction(isDay: boolean): IAction {

        this._nextAction = this.chooseAction();
        this._nextAction.takeAction(this, undefined, isDay);
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
            if (foodRatio < 0.5) {
                if (k === "HARVEST_FOOD") multiplier *= 3;
                if (k === "Eat") multiplier *= 2;
                if (k === "Attack") multiplier *= 0.5;
            } else if (foodRatio < 1.0) {
                if (k === "HARVEST_FOOD") multiplier *= 1.8;
                if (k === "Eat") multiplier *= 1.4;
            }

            //LOW ENERGY — rabbits prefer sleep
            if (energy < 30) {
                if (k === "Sleep") multiplier *= 3;
                if (k === "Attack" || k.startsWith("UPGRADE_")) multiplier *= 0.5;
            } else if (energy < 60) {
                if (k === "Sleep") multiplier *= 1.5;
            }

            //HIGH UNREST — meditation & calmness favored
            if (unrest > 0.7) {
                if (k === "MEDITATE") multiplier *= 3;
                if (k === "Attack") multiplier *= 0.6;
            }

            //SURPLUS FOOD — more willingness to upgrade or attack
            if (foodRatio > 2 && energy > 60 && unrest < 0.5) {
                if (k.startsWith("UPGRADE_") || k === "Attack") multiplier *= 1.5;
            }

            weights[k] = Math.max(0, weights[k] * multiplier);
        }

        //If everything got squashed to zero somehow, fall back to base weights
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        const finalWeights = totalWeight > 0 ? weights : baseWeights;

        // --- Weighted random selection ---
        const options = Object.entries(finalWeights)
            .filter(([_, w]) => w > 0)
            .map(([key, weight]) => ({
                action: this.createActionByKey(key as ActionNameKey),
                weight
            }));

        return weightedRandomObject(options).action;
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