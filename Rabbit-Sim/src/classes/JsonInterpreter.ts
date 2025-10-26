interface ActionData {
  colonyId: number;
  colonyName: string;
  action: string;
}

interface ColonyData {
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

export interface TurnData {
  turn: number;
  actions: ActionData;
  colonies: ColonyData[];
}

interface GameData {
  initial: ColonyData[];
  turns: TurnData[];
}

export class JSONInterpreter {
  

  private turnQueue: TurnData[] = [];
  

  private initialState: ColonyData[] = [];


  interpret(json: string): boolean {
    try {
      // Parse the JSON string into the new GameData object
      const gameData: GameData = JSON.parse(json);

      // Validate the new structure
      if (gameData && Array.isArray(gameData.turns) && Array.isArray(gameData.initial)) {
        this.turnQueue = gameData.turns;      // Load the turns array into our queue
        this.initialState = gameData.initial; // Load the initial state
        return true;
      } else {
        console.error("Failed to interpret JSON: Data is not in the expected format (missing 'initial' or 'turns' array).");
        this.turnQueue = [];
        this.initialState = [];
        return false;
      }
    } catch (error) {
      console.error("Failed to parse JSON string:", error);
      this.turnQueue = [];
      this.initialState = [];
      return false;
    }
  }

  getInitialState(): ColonyData[] {
    return this.initialState;
  }

  getNextTurn(): TurnData | undefined {
    // .shift() removes and returns the *first* element of the array (Turn 0, then Turn 1, etc.)
    if (this.turnQueue.length > 0) {
      return this.turnQueue.shift();
    }
    
    return undefined; // No more turns left
  }


  hasMoreTurns(): boolean {
    return this.turnQueue.length > 0;
  }


  getRemainingTurnsCount(): number {
    return this.turnQueue.length;
  }
}