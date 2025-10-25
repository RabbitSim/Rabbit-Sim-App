class Fox {
    private _attack: number;
    private _health: number;
    
    constructor(){
        this._attack = 10;
        this._health = 100;
    }

    get attack(): number {
        return this._attack;
    }

    set attack(newAttack:number){
        this._attack = newAttack;
    }

    get health(): number {
        return this._health;
    }

    set health(newHealth: number){
        this._health = newHealth;
    }
}