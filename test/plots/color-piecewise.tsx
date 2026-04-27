import {Plot, CellX, identity} from "../../src/react/index.js";
import * as d3 from "d3";

export function colorPiecewiseLinearDomain() {
  return (
    <Plot color={{legend: true, type: "linear", domain: [0, 10, 20], range: ["red", "blue"]}}>
      <CellX data={d3.range(11)} fill={identity} />
    </Plot>
  );
}

export function colorPiecewiseLinearDomainReverse() {
  return (
    <Plot color={{legend: true, type: "linear", domain: [0, 10, 20], reverse: true, range: ["red", "blue"]}}>
      <CellX data={d3.range(11)} fill={identity} />
    </Plot>
  );
}

export function colorPiecewiseLinearRange() {
  return (
    <Plot color={{legend: true, type: "linear", domain: [0, 10], range: ["red", "blue", "green"]}}>
      <CellX data={d3.range(11)} fill={identity} />
    </Plot>
  );
}

export function colorPiecewiseLinearRangeHcl() {
  return (
    <Plot color={{legend: true, type: "linear", domain: [0, 10], range: ["red", "blue", "green"], interpolate: "hcl"}}>
      <CellX data={d3.range(11)} fill={identity} />
    </Plot>
  );
}

export function colorPiecewiseLinearRangeReverse() {
  return (
    <Plot color={{legend: true, type: "linear", domain: [0, 10], reverse: true, range: ["red", "blue", "green"]}}>
      <CellX data={d3.range(11)} fill={identity} />
    </Plot>
  );
}
