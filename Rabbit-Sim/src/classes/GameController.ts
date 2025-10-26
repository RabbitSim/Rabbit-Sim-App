import {Colony} from "./Colony.ts"
import {OnlySleepAndEat} from "./strategies/OnlySleepAndEat.ts";
import {Logger} from "./logger/logger.ts";
import type {ColonyState} from "./logger/helperInterfaces.ts";
import { Time } from "./Time"

export class GameController {

    private _colonies: Array<Colony> = [];
    private _winnerDeclared: boolean = false;
    // private _winner?: Colony;
    private _priority: number = 0;
    private _logger: Logger = new Logger();
    private _turn: number = 0;
    private _time: Time;


    constructor() {
        this._time = new Time();
    }

    private getColonyStates(): ColonyState[] {
        return this._colonies.map(colony => colony.toJSON());
    }

    private gameLoop(): void {

        // Declare Colonies
        this.colonies.push(
            new Colony("number1", 100, 100, 100, 100, 99, 900, 5, new OnlySleepAndEat()),
            new Colony("number2", 100, 100, 100, 100, 99, 900, 5, new OnlySleepAndEat())
        )

        // Recording initial state
        const colonyStates: ColonyState[] = this.getColonyStates();
        this.logger.recordInitial(colonyStates);

        while (!this._winnerDeclared) {
            this.takeTurns();
            this._time.nextTurn();
            if (this._winnerDeclared) { break; }
        }

        // Do something with the log here
    }

    private takeTurns() {
        let index: number = this.priority;
        const n: number = this.colonies.length;
        if (n <= 0) {return;} // No colonies!

        const isDay = this._time.day;

        for (let i: number = 0; i < n; i++) {
            const colony = this.colonies[index % n];

            if (!colony.isDefeated) { // Defeated colonies do not get actions
                 const action = colony.takeAction(isDay);

                 this.logger.recordTurn({
                     colonyId : colony.id,
                     colonyName : colony.name,
                     action : action.name,
                 },
                   this.getColonyStates()
                 );
            }
            index++;
            this.turn++;

            console.log("Hello!")
            console.log(this.logger.toJSON())
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

    get logger(): Logger {
        return this._logger;
    }

    get turn(): number {
        return this._turn;
    }

    set turn(value: number) {
        this._turn = value;
    }
}