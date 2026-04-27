import {Plot, RectY, RuleY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinMassSpecies() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot
      x={{
        round: true,
        label: "Body mass (g)"
      }}
      y={{
        grid: true
      }}
    >
      <RectY
        data={data}
        {...binX({y: "count"}, {x: "body_mass_g", fill: "species", title: (d) => `${d.species} ${d.sex}`})}
      />
      <RuleY data={[0]} />
    </Plot>
  );
}
