

export interface ColonyState {
    id: number;
    name: string;
    population: number;
    food: number;
    energy: number;
    defense: number;
    offense: number;
    agriculture: number;
    isDefeated: boolean;
    strategy: string;
}

export interface ActionRecord {
    colonyId: number;
    colonyName: string;
    action: string;
}

export interface TurnRecord {
    turn: number;
    actions: ActionRecord;
    colonies: ColonyState[];
}

export interface GameLog {
    initial: ColonyState[];  // first snapshot before any turn
    turns: TurnRecord[];
}