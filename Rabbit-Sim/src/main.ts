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

  const runner = new SimRunner(strategies);
  const result = runner.run();
  const summary = runner.summarize();

  console.log("\n=== Simulation Summary ===");
  console.log(`Winner: ${summary["Winner"]}`);
  console.log(`Turns Survived: ${summary["Turns Survived"]}`);

  console.log("\n--- Death Log ---");
  if (Array.isArray(summary["Deaths"])) {
    summary["Deaths"].forEach((d: any) => {
      console.log(`Turn ${d.turn}: ${d.colony} died (${d.cause}) after "${d.lastAction}"`);
    });
  } else {
    console.log(summary["Deaths"]);
  }

  console.log("\n--- Final Colonies ---");
  summary["Final Colonies"].forEach((c: any) => {
    console.log(
      `${c.name.padEnd(20)} | Pop: ${c.population.padStart(6)} | Food: ${c.food
        .toString()
        .padStart(4)} | Defeated: ${c.isDefeated ? "L" : "W"}`
    );
  });
  console.log("\nFinal Colony States:");
  console.table(result.colonies);
}

main();
