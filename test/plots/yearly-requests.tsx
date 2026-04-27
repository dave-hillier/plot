import {Plot, BarY} from "../../src/react/index.js";

const requests = [
  [new Date("2002-01-01"), 9],
  [new Date("2003-01-01"), 17],
  [new Date("2004-01-01"), 12],
  [new Date("2005-01-01"), 5],
  [new Date("2006-01-01"), 12],
  [new Date("2007-01-01"), 18],
  [new Date("2008-01-01"), 16],
  [new Date("2009-01-01"), 11],
  [new Date("2010-01-01"), 9],
  [new Date("2011-01-01"), 8],
  [new Date("2012-01-01"), 9],
  [new Date("2019-01-01"), 20]
];

export async function yearlyRequests() {
  return (
    <Plot
      label={null}
      x={{interval: 1, tickFormat: ""}} // TODO https://github.com/observablehq/plot/issues/768
    >
      <BarY data={requests} x={([date]) => date.getUTCFullYear()} y="1" />
    </Plot>
  );
}

export async function yearlyRequestsDate() {
  return (
    <Plot label={null} x={{interval: "year"}}>
      <BarY data={requests} x="0" y="1" />
    </Plot>
  );
}
