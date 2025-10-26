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

    private chooseAction() : IAction {
        const weights: Record<ActionNameKey, number> = this._strategy.getWeights(this.createMetrics());

        const myArray = [];
        for (const key in weights) {
            switch (key) {
                case "Attack":
                    myArray.push({"action": new Attack(), "weight": weights[key]});
                    break;
                case "Eat":
                    myArray.push({"action": new Eat(), "weight": weights[key]});
                    break;
                case "Sleep":
                    myArray.push({"action": new Sleep(), "weight": weights[key]});
                    break;
                case "UPGRADE_AGRICULTURE":
                    myArray.push({"action": new UpgradeAgriculture(), "weight": weights[key]});
                    break;
                case "UPGRADE_DEFENCE":
                    myArray.push({"action": new UpgradeDefence(), "weight": weights[key]});
                    break;
                case "UPGRADE_OFFENSE":
                    myArray.push({"action": new UpgradeOffence(), "weight": weights[key]});
                    break;
                case "HARVEST_FOOD":
                    myArray.push({"action": new HarvestFood(), "weight": weights[key]});
                    break;
                case "MEDITATE":
                    myArray.push({"action": new Meditate(), "weight": weights[key]});
                    break;

                default:
                    break;
            }
        }
        return weightedRandomObject(myArray).action;
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