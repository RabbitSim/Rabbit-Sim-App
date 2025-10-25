class Time {
    day : boolean
    night : boolean
    dayNum : number 
    turnNum : number

    constructor() {
    this.day = true
    this.night = false
    this.dayNum = 0
    this.turnNum = 0
    }
    nextTurn(){
        this.turnNum += 1;
        if (this.turnNum == 4){
            this.night = true;
        }
        if (this.turnNum == 9){
            this.turnNum = 0;
            this.dayNum++;
            this.day = true;
        }
    }
}