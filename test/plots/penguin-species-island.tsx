import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinSpeciesIsland() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot
      y={{
        grid: true
      }}
    >
      <BarY data={data} {...groupX({y: "count", sort: "z"}, {x: "species", fill: "island"})} />
      <RuleY data={[0]} />
    </Plot>
  );
}
