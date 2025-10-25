import {Colony} from "./Colony.ts"
import {OnlySleepAndEat} from "./strategies/OnlySleepAndEat.ts";

export class GameController {

    private _colonies: Array<Colony> = [];
    private _winnerDeclared: boolean = false;
    // private _winner?: Colony;
    private _priority: number = 0;


    constructor() {

    }


    private gameLoop(): void {

        // Declare Colonies
        this.colonies.push(
            new Colony("number1", 100, 100, 100, 100, 99, 900, 5, new OnlySleepAndEat())
        )

        while (!this._winnerDeclared) {

            this.takeTurns();

            if (this._winnerDeclared) { break; }
        }
    }

    private takeTurns() {
        let index: number = this.priority;
        const n: number = this.colonies.length;
        if (n <= 0) {return;} // No colonies!

        for (let i = 0; i < n; i++) {
            if (!this.colonies[index % n].isDefeated) { // Defeated colonies do not get actions
                 this.colonies[index % n].takeAction();

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

    public startGame(): void {
        this.gameLoop();
    }
}