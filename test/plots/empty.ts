import * as Plot from "replot";
import {svg} from "htl";

export async function empty() {
  return Plot.plot({
    grid: true,
    inset: 6,
    x: {type: "linear"},
    y: {type: "linear"},
    marks: [
      Plot.frame(),
      undefined,
      null,
      () => null,
      () => undefined,
      () => svg`<circle cx=50% cy=50% r=5 fill=green>`
    ]
  });
}
