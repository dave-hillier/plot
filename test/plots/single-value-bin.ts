import * as Plot from "replot";

export async function singleValueBin() {
  return Plot.rectY([3], Plot.binX()).plot();
}
