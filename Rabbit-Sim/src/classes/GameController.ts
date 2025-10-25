import {Colony} from "./Colony.ts"

class GameController {

    private _colonies: Set<Colony>;
    private _winnerDeclared: boolean = false;
    private _winner: Colony;


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

            for (const colony of this._colonies) { // TODO: Implement turn based action execution
                colony.takeAction();
            }

            if (this._winnerDeclared) { break; }
        }

        declareWinner(this._winner);
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

    get colonies(): Set<Colony> {
        return this._colonies;
    }

    set colonies(value: Set<Colony>) {
        this._colonies = value;
    }



}