// src/main.ts
import { SimRunner } from "./classes/SimRunner";
import { AggressiveStrategy } from "./classes/strategies/AggressiveStrategy";
import { DefensiveStrategy } from "./classes/strategies/DefensiveStrategy";
import { FraserStrategy } from "./classes/strategies/FraserStrategy";
import { OnlySleepAndEat } from "./classes/strategies/OnlySleepAndEat";
function main() {
  const strategies = [
    new AggressiveStrategy(),
    new DefensiveStrategy(),
    new FraserStrategy(),
    new OnlySleepAndEat(),
  ];

  const runner = new SimRunner(strategies, 50);
  const results = runner.runAll();
  const summary = runner.summarize();

  console.log("\n=== Simulation Summary ===");
  console.table(summary);
}

main();
