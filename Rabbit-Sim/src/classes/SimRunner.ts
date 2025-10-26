// src/classes/SimRunner.ts
import { GameController } from "./GameController.ts";
import { Colony } from "./Colony.ts";
import type { IStrategy } from "./strategies/IStrategy.ts";
import { ColonyMath } from "./math/ColonyMath.ts";

type SimResult = {
  run: number;
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
  private _runs: number;
  private _results: SimResult[] = [];

  constructor(strategies: IStrategy[], runs = 100) {
    this._strategies = strategies;
    this._runs = runs;
  }

  public runAll(): SimResult[] {
    console.log(`Running ${this._runs} simulations with ${this._strategies.length} strategies...`);
    for (let i = 0; i < this._runs; i++) {
      const result = this.runSingleMatch(i);
      this._results.push(result);
    }
    return this._results;
  }

  private runSingleMatch(runIndex: number): SimResult {
    const controller = new GameController();
    controller.resetGame();

    // Randomized starting conditions based on ColonyMath level curves
    const colonies: Colony[] = this._strategies.map((strategy) => {
      const basePop = 100 + Math.floor(Math.random() * 20) - 10; // ±10 variance
      const agriLevel = 5 + Math.floor(Math.random() * 3); // some start with better farms
      const offLevel = 5 + Math.floor(Math.random() * 3);
      const defLevel = 5 + Math.floor(Math.random() * 3);

      const agriBoost = ColonyMath.agricultureMultiplier(agriLevel);
      const offBoost = ColonyMath.offenceMultiplier(offLevel);
      const defBoost = ColonyMath.defenceMultiplier(defLevel);

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

    controller.colonies = colonies;
    controller.startGame();

    const winner = controller.winnerDeclared
      ? controller["winner"]?.name
      : undefined;

    const coloniesData = controller.colonies.map((c) => ({
      name: c.name,
      population: c.population,
      isDefeated: c.isDefeated,
      food: c.foodStorage,
      unrest: c.unrest,
      agriculture: c.agriculture,
      offence: c.offence,
      defence: c.defence,
    }));

    return {
      run: runIndex + 1,
      winner,
      turns: controller.turn,
      colonies: coloniesData,
    };
  }

  public summarize(): Record<string, number> {
    const tally: Record<string, number> = {};
    for (const res of this._results) {
      const winner = res.winner ?? "None";
      tally[winner] = (tally[winner] ?? 0) + 1;
    }
    return tally;
  }

  public toCSV(): string {
    const lines: string[] = ["run,winner,turns"];
    this._results.forEach((res) =>
      lines.push(`${res.run},${res.winner ?? "None"},${res.turns}`)
    );
    return lines.join("\n");
  }
}
