import {Plot, Frame} from "../../src/react/index.js";

export async function emptyLegend() {
  return (
    <Plot
      color={{
        legend: true // ignored because no color scale
      }}
    >
      <Frame />
    </Plot>
  );
}
