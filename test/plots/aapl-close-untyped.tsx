import {Plot, Line, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplCloseUntyped() {
  const AAPL = await d3.csv<any>("data/aapl.csv");
  return (
    <Plot
      x={{
        type: "utc"
      }}
      y={{
        type: "linear",
        grid: true
      }}
    >
      <Line data={AAPL} x="Date" y="Close" />
      <RuleY data={[0]} />
    </Plot>
  );
}
