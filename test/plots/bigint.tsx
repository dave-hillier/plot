import {Plot, Auto, Line, TickX, CellX, BarY} from "../../src/react/index.js";
import * as d3 from "d3";

const integers = d3.range(40).map((int) => ({
  big1: BigInt(int),
  big2: BigInt(int * int)
}));

export async function bigint1() {
  return (
    <Plot>
      <Auto data={integers} x="big2" />
    </Plot>
  );
}

export async function bigint2() {
  return (
    <Plot>
      <Line data={integers} x="big1" y="big2" marker="circle" />
    </Plot>
  );
}

export async function bigintLog() {
  return (
    <Plot x={{type: "log"}}>
      <TickX data={integers} x="big2" stroke="big1" />
    </Plot>
  );
}

export async function bigintOrdinal() {
  return (
    <Plot color={{type: "log", legend: true}}>
      <CellX data={integers.slice(1, 11)} x="big1" fill="big1" />
    </Plot>
  );
}

export async function bigintStack() {
  return (
    <Plot>
      <BarY data={integers} x={(d, i) => i % 5} y="big1" />
    </Plot>
  );
}
