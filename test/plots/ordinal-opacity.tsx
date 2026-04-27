import {Plot, CellX, identity} from "../../src/react/index.js";
import * as d3 from "d3";

export async function ordinalOpacity() {
  return (
    <Plot opacity={{type: "ordinal"}}>
      <CellX data={d3.range(10)} fill="red" opacity={identity} />
    </Plot>
  );
}

export async function ordinalOpacityImplicitZero() {
  return (
    <Plot opacity={{type: "ordinal"}}>
      <CellX data={d3.range(2, 10)} fill="red" opacity={identity} />
    </Plot>
  );
}

export async function ordinalOpacityRamp() {
  return (
    <Plot opacity={{type: "ordinal", legend: "ramp"}}>
      <CellX data={d3.range(10)} fill="red" opacity={identity} />
    </Plot>
  );
}

export async function ordinalOpacityThreshold() {
  return (
    <Plot opacity={{type: "threshold", legend: true, domain: [2, 5, 8], range: [0.2, 0.4, 0.6, 0.8]}}>
      <CellX data={d3.range(10)} fill="red" opacity={identity} />
    </Plot>
  );
}
