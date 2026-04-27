import {Plot, RuleX, Dot, RuleY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function letterFrequencyLollipop() {
  const alphabet = await d3.csv<any>("data/alphabet.csv", d3.autoType);
  return (
    <Plot y={{grid: true}}>
      <RuleX data={alphabet} x="letter" y="frequency" />
      <Dot data={alphabet} x="letter" y="frequency" fill="currentColor" />
      <RuleY data={[0]} />
    </Plot>
  );
}
