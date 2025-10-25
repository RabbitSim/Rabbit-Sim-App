class Fox {
    private _attack: number;
    private _health: number;
    
    constructor(attack:number = 10, health:number = 100){
        this._attack = attack;
        this._health = health;
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