import {Plot, Density, Dot, Frame} from "../../src/react/index.js";
import * as d3 from "d3";

export async function faithfulDensity() {
  const faithful = await d3.tsv<any>("data/faithful.tsv", d3.autoType);
  return (
    <Plot inset={20}>
      <Density data={faithful} x="waiting" y="eruptions" stroke="steelblue" strokeWidth={0.25} />
      <Density data={faithful} x="waiting" y="eruptions" stroke="steelblue" thresholds={4} />
      <Dot data={faithful} x="waiting" y="eruptions" fill="currentColor" r={1.5} />
    </Plot>
  );
}

export async function faithfulDensityFill() {
  const faithful = await d3.tsv<any>("data/faithful.tsv", d3.autoType);
  return (
    <Plot inset={30}>
      <Frame fill={0} />
      <Density data={faithful} x="waiting" y="eruptions" fill="density" />
    </Plot>
  );
}
