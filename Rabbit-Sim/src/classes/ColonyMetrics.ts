import  {type Colony} from "./Colony.ts";


export class ColonyMetrics {
    private _population: number;
    private _agriculture: number;
    private _offence: number;
    private _energy: number;
    private _unrest: number;
    private _foodStorage: number;
    private _relationships: Map<Colony, number> = new Map();
    private _defence: number;


    constructor(population: number, agriculture: number, offence: number, energy: number, unrest: number, foodStorage: number, relationships: Map<Colony, number>, defence: number) {
        this._population = population;
        this._agriculture = agriculture;
        this._offence = offence;
        this._energy = energy;
        this._unrest = unrest;
        this._foodStorage = foodStorage;
        this._relationships = relationships;
        this._defence = defence;
    }

    // Getters

    get population(): number {
        return this._population;
    }

    get agriculture(): number {
        return this._agriculture;
    }

    get offence(): number {
        return this._offence;
    }

    get energy(): number {
        return this._energy;
    }

    get unrest(): number {
        return this._unrest;
    }

    get foodStorage(): number {
        return this._foodStorage;
    }

    get relationships(): Map<Colony, number> {
        return this._relationships;
    }

    get defence(): number {
        return this._defence;
    }
}