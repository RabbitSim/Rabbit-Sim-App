export class Colony {
    private _name: string;
    private _population: string;
    private _agriculture: number;
    private _military: number;
    private _energy: number;
    private _morale: number;
    private _isDefeated: boolean = false;

    private _nextAction: Action;

    constructor(name: string, population: string, agriculture: number,
    military: number, energy: number, morale: number) {
        // Attributes of each colony
        this._name = name;
        this._population = population;
        this._agriculture = agriculture;
        this._military = military;
        this._energy = energy;
        this._morale = morale;
    }

    public takeAction(): void {
        _nextAction.takeAction();
    }

    // Getters & Setters

    get isDefeated(): boolean {
        return this._isDefeated;
    }

    set isDefeated(value: boolean) {
        this._isDefeated = value;
    }

    get nextAction(): Action {
        return this._nextAction;
    }

    set nextAction(value: Action) {
        this._nextAction = value;
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