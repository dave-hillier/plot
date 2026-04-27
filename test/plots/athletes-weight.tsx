import {Plot, RectY, binX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function athletesWeight() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return (
    <Plot>
      <RectY data={athletes} {...binX({y: "count"}, {x: "weight"})} />
    </Plot>
  );
}
