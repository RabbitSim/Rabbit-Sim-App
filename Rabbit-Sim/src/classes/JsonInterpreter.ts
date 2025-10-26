// --- Interfaces (Recommended for TypeScript) ---
// These define the "shape" of your data

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

/**
 * Represents a single turn's data from the "turns" array.
 */
export interface TurnData {
  turn: number;
  actions: ActionData;
  colonies: ColonyData[];
}

/**
 * Represents the entire structure of the JSON game data file.
 */
interface GameData {
  initial: ColonyData[];
  turns: TurnData[];
}

// --- Class Implementation ---

export class JSONInterpreter {
  
  /**
   * This array will act as our "queue" for all the turns.
   */
  private turnQueue: TurnData[] = [];
  
  /**
   * This array will store the initial state of the colonies.
   */
  private initialState: ColonyData[] = [];

  /**
   * Parses the JSON string, loading the initial state and the array of turns.
   * @param json The full JSON string.
   * @returns True if parsing was successful, false otherwise.
   */
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

  /**
   * Gets the initial state of all colonies before turn 0.
   * Your game/UI should use this to set up the board first.
   * @returns An array of ColonyData objects.
   */
  getInitialState(): ColonyData[] {
    return this.initialState;
  }

  /**
   * This is the "pop off" function.
   * It gets and removes the *next* turn from the front of the queue.
   * @returns The next TurnData object, or `undefined` if the queue is empty.
   */
  getNextTurn(): TurnData | undefined {
    // .shift() removes and returns the *first* element of the array (Turn 0, then Turn 1, etc.)
    if (this.turnQueue.length > 0) {
      return this.turnQueue.shift();
    }
    
    return undefined; // No more turns left
  }

  /**
   * Checks if there are any turns left in the queue.
   * @returns True if there are more turns, false otherwise.
   */
  hasMoreTurns(): boolean {
    return this.turnQueue.length > 0;
  }

  /**
   * Gets the number of turns remaining in the queue.
   * @returns The count of remaining turns.
   */
  getRemainingTurnsCount(): number {
    return this.turnQueue.length;
  }
}