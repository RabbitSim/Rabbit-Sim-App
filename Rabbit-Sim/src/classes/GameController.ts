import {Colony} from "./Colony.ts"
import {OnlySleepAndEat} from "./strategies/OnlySleepAndEat.ts";
import { FraserStrategy } from "./strategies/FraserStrategy.ts";
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
    private _winner?: Colony;


    constructor() {
        this._time = new Time();
    }

    private getColonyStates(): ColonyState[] {
        return this._colonies.map(colony => colony.toJSON());
    }

    private gameLoop(): void {
        // Recording initial state
        // Declare Colonies

        // Recording initial state
        const colonyStates: ColonyState[] = this.getColonyStates();
        this.logger.recordInitial(colonyStates);

        while (!this._winnerDeclared) {
            this.takeTurns();
            this._time.nextTurn();
            this.checkWinner();
            if (this._winnerDeclared) { break; }
        }
        if (this._winner) {
            console.log(` ${this._winner.name} has popped off and rules the warren!`);
            console.log(this.logger.toJSON());
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
                const action = colony.takeAction(isDay, this._colonies);
                const targetName = (action as any)._targetName ?? "-";

                this.logger.recordTurn({
                    colonyId : colony.id,
                    colonyName : colony.name,
                    action: action.name + (targetName !== "-" ? ` - ${targetName}` : ""),
                },
                this.getColonyStates()
                   
                );
                this.checkWinner();
            }
            index++;
            this.turn++;

            if (this._winnerDeclared) return;
        
        }
        

        this.priority = (this.priority + 1) % n;
    }
    
    /**
     * Check victory conditions and mark defeated colonies.
     */
    private checkWinner(): void {
        for (const colony of this.colonies) {
            console.log(
            `[DEBUG TURN ${this.turn}] ${colony.name} — pop=${colony.population.toFixed(4)}, defeated=${colony.isDefeated}`
        );
            if (colony.population <= 0.01 && !colony.isDefeated) {

                colony.isDefeated = true;

                const lastTurn = this.logger.getLog().turns
                    .slice()
                    .reverse()
                    .find(t => t.actions.colonyName === colony.name);

                const lastAction = lastTurn ? lastTurn.actions.action : "Unknown";
                const cause = this.determineCauseOfDeath(colony, lastAction);

                this.logger.recordDeath(this.turn, colony.name, lastAction, cause);

                console.log(`${colony.name} has been wiped out on turn ${this.turn}! Cause: ${cause}`);
            }
        }

        const alive = this.colonies.filter(c => !c.isDefeated);

        if (alive.length === 1) {
            this._winnerDeclared = true;
            this._winner = alive[0];
        } else if (alive.length === 0) {
            this._winnerDeclared = true;
            this._winner = undefined;
        }
        }


    private determineCauseOfDeath(colony: Colony, lastAction: string): string {
        if (colony.foodStorage <= 0) return "starvation";
        if (lastAction === "Attack") return "killed in battle";
        if (lastAction === "HarvestFood") return "collapsed from exhaustion while harvesting";
        if (lastAction === "Sleep") return "never woke up";
        if (lastAction.startsWith("UPGRADE")) return "overworked their builders to death";
        return "mysterious causes";
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
        //Prevent rerunning a finished game
        if (this._winnerDeclared) {
            console.warn("Game already finished. Call resetGame() to start a new one.");
            return;
        }

        //Also guard against double-starts
        if (this._colonies.length > 0 && this._turn > 0) {
            console.warn("Game already in progress. Ignoring start request.");
            return;
        }

        return this.gameLoop();
    }

    public resetGame(): void {
        this._colonies = [];
        this._winnerDeclared = false;
        this._winner = undefined;
        this._priority = 0;
        this._turn = 0;
        this._logger = new Logger(); // fresh log
        this._time = new Time();
        console.log("Game has been reset. Ready to run again.");
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
    get winner(): Colony | undefined {
        return this._winner;
    }
}