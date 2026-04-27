import {Plot, CellX, identity} from "../../src/react/index.js";
import * as d3 from "d3";

export function warnMisalignedDivergingDomain() {
  return (
    <Plot color={{legend: true, type: "diverging", domain: [-5, 5, 10]}}>
      <CellX data={d3.range(-5, 6)} x={identity} fill={identity} />
    </Plot>
  );
}
