import {Plot, AreaY, LineY, RuleY, AxisY, normalizeY, valueof} from "../../src/react/index.js";
import * as d3 from "d3";

export async function aaplCloseVaryingColor() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot y={{grid: true}}>
      <AreaY data={aapl} x="Date" y="Close" fill="Close" fillOpacity={0.2} />
      <LineY data={aapl} x="Date" y="Close" stroke="Close" />
      <RuleY data={[0]} />
    </Plot>
  );
}

export async function aaplClose() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot y={{grid: true}}>
      <AreaY data={aapl} x="Date" y="Close" fillOpacity={0.1} />
      <LineY data={aapl} x="Date" y="Close" />
      <RuleY data={[0]} />
    </Plot>
  );
}

export async function aaplCloseClip() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot clip={true} x={{domain: [new Date(Date.UTC(2015, 0, 1)), new Date(Date.UTC(2015, 3, 1))]}} y={{grid: true}}>
      <AreaY data={aapl} x="Date" y="Close" fillOpacity={0.1} />
      <LineY data={aapl} x="Date" y="Close" />
      <RuleY data={[0]} clip={false} />
    </Plot>
  );
}

export async function aaplCloseDataTicks() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot>
      <AxisY data={d3.ticks(0, 200, 10)} anchor="left" />
      <LineY data={aapl} x="Date" y="Close" />
    </Plot>
  );
}

export async function aaplCloseImplicitGrid() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot y={{grid: true}}>
      <AxisY anchor="left" />
      <LineY data={aapl} x="Date" y="Close" />
    </Plot>
  );
}

export async function aaplCloseGridColor() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot y={{grid: "red"}}>
      <LineY data={aapl} x="Date" y="Close" />
    </Plot>
  );
}

export async function aaplCloseGridInterval() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot x={{grid: "3 months"}}>
      <LineY data={aapl} x="Date" y="Close" />
    </Plot>
  );
}

export async function aaplCloseGridIntervalName() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot x={{grid: "month"}}>
      <LineY data={aapl} x="Date" y="Close" />
    </Plot>
  );
}

export async function aaplCloseGridIterable() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot y={{grid: [100, 120, 140]}}>
      <LineY data={aapl} x="Date" y="Close" />
    </Plot>
  );
}

export async function aaplCloseNormalize() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  const x = new Date("2014-01-01");
  const X = valueof(aapl, "Date");
  return (
    <Plot y={{type: "log", grid: true, tickFormat: ".1f"}}>
      <RuleY data={[1]} />
      <LineY data={aapl} {...normalizeY((I, Y) => Y[I.find((i) => X[i] >= x)], {x: X, y: "Close"})} />
    </Plot>
  );
}
