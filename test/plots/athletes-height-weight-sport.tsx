import {Plot, Dot, shuffle} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesHeightWeightSport() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return (
    <Plot grid={true} height={640}>
      <Dot data={athletes} {...shuffle({seed: 42, x: "weight", y: "height", fill: "sport"})} />
    </Plot>
  );
}
