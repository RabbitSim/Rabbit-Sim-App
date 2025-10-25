class Colony {
    private _name: string;
    private _population: string;
    private _agriculture: number;
    private _military: number;
    private _energy: number;
    private _morale: number;

    constructor(name: string, population: string, agriculture: number,
    military: number, energy: number, morale: number) {
        this._name = name;
        this._population = population;
        this._agriculture = agriculture;
        this._military = military;
        this._energy = energy;
        this._morale = morale;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get population(): string {
        return this._population;
    }

    set population(value: string) {
        this._population = value;
    }

    get agriculture(): number {
        return this._agriculture;
    }

    set agriculture(value: number) {
        this._agriculture = value;
    }

    get military(): number {
        return this._military;
    }

    set military(value: number) {
        this._military = value;
    }

    get energy(): number {
        return this._energy;
    }

    set energy(value: number) {
        this._energy = value;
    }

    get morale(): number {
        return this._morale;
    }

    set morale(value: number) {
        this._morale = value;
    }
}