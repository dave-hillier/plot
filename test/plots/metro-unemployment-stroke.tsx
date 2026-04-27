import {Plot, Line, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function metroUnemploymentStroke() {
  const data = await d3.csv<any>("data/bls-metro-unemployment.csv", d3.autoType);
  return (
    <Plot
      color={{
        scheme: "blues",
        range: [0.4, 1]
      }}
    >
      <Line data={data} x="date" y="unemployment" stroke="division" />
      <RuleY data={[0]} />
    </Plot>
  );
}
