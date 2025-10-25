import type { Action } from './actions/Action'

export class Colony {
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

    private _nextAction: Action | null = null;

    constructor(name: string, population: number, agriculture: number,
    offence: number, energy: number, morale: number, foodStorage: number, defence: number) {
        // Attributes of each colony
        this._name = name;
        this._population = population;
        this._agriculture = agriculture;
        this._offence = offence;
        this._energy = energy;
        this._unrest = morale;
        this._foodStorage = foodStorage;
        this._defence = defence;
    }

    public takeAction(): void {

        this._nextAction = this.chooseAction();
        this._nextAction.takeAction(this);
    }

    private chooseAction(): Action {
        //TODO: Implement action selecting algorithm

    }

    // Getters & Setters

    get isDefeated(): boolean {
        return this._isDefeated;
    }

    set isDefeated(value: boolean) {
        this._isDefeated = value;
    }

    get nextAction(): Action | null {
        return this._nextAction;
    }

    set nextAction(value: Action | null) {
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
}