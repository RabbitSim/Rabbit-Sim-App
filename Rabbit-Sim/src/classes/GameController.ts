import {Colony} from "./Colony.ts"

class GameController {

    private _colonies: Set<Colony>;


    constructor(colonies: Set<Colony>) {
        this._colonies = colonies;
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