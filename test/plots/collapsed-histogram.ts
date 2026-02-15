import * as Plot from "replot";

export async function collapsedHistogram() {
  return Plot.rectY([1, 1, 1], Plot.binX()).plot();
}
