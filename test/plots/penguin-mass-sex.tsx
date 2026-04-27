import {Plot, RectY, RuleY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinMassSex() {
  const data = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot
      x={{
        round: true,
        label: "Body mass (g)"
      }}
      facet={{
        data,
        y: "sex",
        marginRight: 70
      }}
    >
      <RectY data={data} {...binX({y: "count"}, {x: "body_mass_g"})} />
      <RuleY data={[0]} />
    </Plot>
  );
}
