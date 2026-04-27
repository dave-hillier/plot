import {Plot, BarY, RuleY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function penguinSex() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot>
      <BarY data={penguins} {...groupX({y: "count"}, {x: "sex"})} />
      <RuleY data={[0]} />
    </Plot>
  );
}
