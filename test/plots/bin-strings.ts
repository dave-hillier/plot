import * as Plot from "replot";

export async function binStrings() {
  return Plot.rectY(["9.6", "9.6", "14.8", "14.8", "7.2"], Plot.binX()).plot();
}
