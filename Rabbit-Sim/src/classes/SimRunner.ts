import { GameController } from "./GameController.ts";
import { Colony } from "./Colony.ts";
import type { IStrategy } from "./strategies/IStrategy.ts";

type SimResult = {
  winner?: string;
  turns: number;
  colonies: {
    name: string;
    population: number;
    isDefeated: boolean;
    food: number;
    unrest: number;
    agriculture: number;
    offence: number;
    defence: number;
  }[];
};

export class SimRunner {
  private _strategies: IStrategy[];
  private _controller: GameController;
  private _result?: SimResult;

  constructor(strategies: IStrategy[]) {
    this._strategies = strategies;
    this._controller = new GameController();
  }

  /** Runs one full simulation (one persistent world). */
  public run(): SimResult {
    console.log(`Running single simulation with ${this._strategies.length} strategies...`);

    // Reset and initialize the game world
    this._controller.resetGame();

    // Create colonies once — persistent through all turns
    const colonies: Colony[] = this._strategies.map((strategy) => {
      const basePop = 100 + Math.floor(Math.random() * 20) - 10; // ±10 variation
      const agriLevel = 5 + Math.floor(Math.random() * 3);
      const offLevel = 5 + Math.floor(Math.random() * 3);
      const defLevel = 5 + Math.floor(Math.random() * 3);

      const energy = 100;
      const unrest = 0.1 + Math.random() * 0.05;
      const food = 500 + Math.floor(Math.random() * 200);

      return new Colony(
        strategy.constructor.name,
        basePop,
        agriLevel,
        offLevel,
        energy,
        unrest,
        food,
        defLevel,
        strategy
      );
    });

    this._controller.colonies = colonies;
    this._controller.startGame();

    const winner = this._controller.winnerDeclared
      ? this._controller["winner"]?.name
      : undefined;

    const coloniesData = this._controller.colonies.map((c) => ({
      name: c.name,
      population: c.population,
      isDefeated: c.isDefeated,
      food: c.foodStorage,
      unrest: c.unrest,
      agriculture: c.agriculture,
      offence: c.offence,
      defence: c.defence,
    }));

    this._result = {
      winner,
      turns: this._controller.turn,
      colonies: coloniesData,
    };

    return this._result;
  }

  /** Simple summary (for your console.table). */
  public summarize(): Record<string, any> {
    if (!this._result) return { "No results yet": 0 };

    const summary: Record<string, any> = {};

    //Winner info
    const winner = this._result.winner ?? "None";
    summary["Winner"] = winner;
    summary["Turns Survived"] = this._result.turns;

    //Death log (if available)
    const log = this._controller.logger.getLog();
    const deaths = log.deaths ?? [];

    if (deaths.length > 0) {
      summary["Deaths"] = deaths.map((d) => ({
        turn: d.turn,
        colony: d.colonyName,
        cause: d.cause,
        lastAction: d.lastAction,
      }));
    } else {
      summary["Deaths"] = "None — all lived or died offscreen.";
    }

    //Final populations snapshot
    summary["Final Colonies"] = this._result.colonies.map((c) => ({
      name: c.name,
      population: c.population.toFixed(1),
      food: Math.round(c.food),
      isDefeated: c.isDefeated,
    }));

    return summary;
  }

}
