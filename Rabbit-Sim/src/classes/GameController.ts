import {Colony} from "./Colony.ts"

class GameController {

    private _colonies: Array<Colony> = [];
    private _winnerDeclared: boolean = false;
    private _winner: Colony;
    private _priority: number = 0;


    constructor(colonies: Set<Colony>) {
        this._colonies = colonies;
    }

    private gameLoop(): void {

        // Declare Colonies
        //TODO: Implement colony declaration

        while (!this._winnerDeclared) {
            for (const colony of this._colonies) {
                if (colony.isDefeated) {
                    continue;
                }
                // Colonies declare their next action
                colony.declareAction(); //TODO: Implement action declaration
            }

            this.executeActionsInTurn();

            if (this._winnerDeclared) { break; }
        }

        declareWinner(this._winner);
    }

    private executeActionsInTurn() {
        let index: number = this.priority;
        const n: number = this.colonies.length;
        if (n <= 0) {return;} // No colonies!

        for (let i = 0; i < n; i++) {
            if (!this.colonies[index % n].isDefeated) { // Defeated colonies do not get actions
                 this.colonies[index % n].takeAction();
            }
            index++;
        }

        this.priority = (this.priority + 1) % n;
    }

    private declareWinner(): void {
        // TODO: Implement declareWinner
    }

    private takeActions() {
        this._colonies.forEach((colony: Colony) => {
            colony.takeAction();
        });
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

    get winner(): Colony {
        return this._winner;
    }

    set winner(value: Colony) {
        this._winner = value;
    }

    get priority(): number {
        return this._priority;
    }

    set priority(value: number) {
        this._priority = value;
    }
}