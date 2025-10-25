import {Colony} from "./Colony.ts"
import {OnlySleepAndEat} from "./strategies/OnlySleepAndEat.ts";
import { Time } from "./Time"

export class GameController {

    private _colonies: Array<Colony> = [];
    private _winnerDeclared: boolean = false;
    // private _winner?: Colony;
    private _priority: number = 0;
    private _time: Time;


    constructor() {
        this._time = new Time();
    }

    private gameLoop(): void {

        // Declare Colonies
        this.colonies.push(
            new Colony("number1", 100, 100, 100, 100, 99, 900, 5, new OnlySleepAndEat())
        )

        while (!this._winnerDeclared) {

            this.takeTurns();
            this._time.nextTurn();
            if (this._winnerDeclared) { break; }
        }
    }

    private takeTurns() {
        let index: number = this.priority;
        const n: number = this.colonies.length;
        if (n <= 0) {return;} // No colonies!

        const isDay = this._time.day;

        for (let i = 0; i < n; i++) {
            const colony = this.colonies[index % n];
            if (!colony.isDefeated) { // Defeated colonies do not get actions
                colony.takeAction(isDay);

                console.log(this.colonies[index % n].population);
            }
            index++;
        }

        this.priority = (this.priority + 1) % n;
    }

    // Getters and Setters  

    get colonies(): Array<Colony> {
        return this._colonies;
    }

    set colonies(value: Array<Colony>) {
        this._colonies = value;
    }

    get winnerDeclared(): boolean {
        return this._winnerDeclared;
    }

    set winnerDeclared(value: boolean) {
        this._winnerDeclared = value;
    }


    get priority(): number {
        return this._priority;
    }

    set priority(value: number) {
        this._priority = value;
    }

    get time(): Time {
        return this._time;
    }

    public startGame(): void {
        this.gameLoop();
    }
}