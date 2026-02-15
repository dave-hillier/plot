import * as Plot from "replot";

export async function highCardinalityOrdinal() {
  return Plot.plot({
    color: {
      type: "ordinal"
    },
    marks: [Plot.cellX("ABCDEFGHIJKLMNOPQRSTUVWXYZ")]
  });
}
