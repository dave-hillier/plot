import {Plot, AreaY, RuleY, LineY} from "../../src/react/index.js";
import * as d3 from "d3";

export async function downloads() {
  const downloads = (await d3.csv<any>("data/downloads.csv", d3.autoType)).filter((d) => d.downloads > 0);
  return (
    <Plot>
      <AreaY data={downloads} x="date" interval="day" y="downloads" curve="step" fill="#ccc" />
      <RuleY data={[0]} />
      <LineY data={downloads} x="date" interval="day" y="downloads" curve="step" strokeWidth={1} />
    </Plot>
  );
}
