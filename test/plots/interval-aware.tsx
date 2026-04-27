import {Plot, BarY, binY, groupX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function intervalAwareBin() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return (
    <Plot x={{interval: 10}}>
      <BarY data={olympians} {...binY({fill: "count"}, {x: "weight", y: "height", inset: 0})} />
    </Plot>
  );
}

export async function intervalAwareGroup() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return (
    <Plot x={{interval: "5 years"}}>
      <BarY data={olympians} {...groupX({y: "count"}, {x: "date_of_birth"})} />
    </Plot>
  );
}

export async function intervalAwareStack() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return (
    <Plot x={{interval: "5 years"}}>
      <BarY data={olympians} x="date_of_birth" y={1} />
    </Plot>
  );
}
