import * as Plot from "replot";

export async function autoHeightEmpty() {
  return Plot.rectY([], {x: "date", y: "visitors", fy: "path"}).plot();
}
