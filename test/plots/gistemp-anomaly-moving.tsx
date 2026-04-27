import {Plot, RuleY, Dot, Line, windowY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function gistempAnomalyMoving() {
  const data = await d3.csv<any>("data/gistemp.csv", d3.autoType);
  return (
    <Plot
      y={{label: "Temperature anomaly (°C)", tickFormat: "+f", grid: true}}
      color={{scheme: "BuRd", symmetric: false}}
    >
      <RuleY data={[0]} />
      <Dot data={data} x="Date" y="Anomaly" stroke="Anomaly" />
      <Line data={data} {...windowY({k: 24}, {x: "Date", y: "Anomaly"})} />
    </Plot>
  );
}
