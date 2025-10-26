export class Time {
    private static readonly NIGHT_START = 4;
    private static readonly CYCLE_RESET = 9;
    private _day : boolean
    private _night : boolean
    private _dayNum : number 
    private _turnNum : number

    constructor() {
    this._day = true
    this._night = false
    this._dayNum = 0
    this._turnNum = 0
    }
    nextTurn(){
        this._turnNum += 1;
        if (this._turnNum == Time.NIGHT_START){
            this._night = true;
            this._day = false;
        }
        if (this._turnNum == Time.CYCLE_RESET){
            this._turnNum = 0;
            this._dayNum++;
            this._day = true;
            this._night = false;
        }
    }
    reset(){
        this._day = true;
        this._night = false;
        this._dayNum = 0;
        this._turnNum = 0;
    }

    get day(): boolean { return this._day; }
    get night(): boolean { return this._night; }
    get dayNum(): number { return this._dayNum; }
    get turnNum(): number { return this._turnNum; }
}