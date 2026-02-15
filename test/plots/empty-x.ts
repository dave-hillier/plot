import * as Plot from "replot";

export async function emptyX() {
  return Plot.plot({
    grid: true,
    x: {
      domain: [0, 1],
      axis: null
    },
    marks: [Plot.frame()]
  });
}
