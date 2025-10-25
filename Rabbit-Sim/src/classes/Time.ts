class Time {
    _day : boolean
    _night : boolean
    _dayNum : number 
    _turnNum : number

    constructor() {
    this._day = true
    this._night = false
    this._dayNum = 0
    this._turnNum = 0
    }
    nextTurn(){
        this._turnNum += 1;
        if (this._turnNum == 4){
            this._night = true;
            this._day = false;
        }
        if (this._turnNum == 9){
            this._turnNum = 0;
            this._dayNum++;
            this._day = true;
            this._night = false;
        }
    }
}