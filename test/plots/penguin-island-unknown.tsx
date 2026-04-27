import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinIslandUnknown() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot
      color={{
        domain: ["Dream"],
        unknown: "#ccc"
      }}
    >
      <BarY data={penguins} {...groupX({y: "count", sort: "z"}, {x: "sex", fill: "island"})} />
      <RuleY data={[0]} />
    </Plot>
  );
}
