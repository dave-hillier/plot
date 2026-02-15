import * as Plot from "replot";

export async function emptyLegend() {
  return Plot.plot({
    color: {
      legend: true // ignored because no color scale
    },
    marks: [Plot.frame()]
  });
}
