class Colony {
    name: string;
    population: string;
    agriculture: number;
    military: number;
    energy: number;
    morale: number;

    constructor(name: string, population: string, agriculture: number,
    military: number, energy: number, morale: number) {
        this.name = name;
        this.population = population;
        this.agriculture = agriculture;
        this.military = military;
        this.energy = energy;
        this.morale = morale;
    }
}