import {Plot, BarX, Frame} from "../../src/react/index.js";

export async function tickFormatEmptyDomain() {
  return (
    <Plot y={{tickFormat: "%W"}}>
      <BarX data={[]} />
      <Frame />
    </Plot>
  );
}

export async function tickFormatEmptyFacetDomain() {
  return (
    <Plot fy={{tickFormat: "%W"}}>
      <BarX data={[]} />
      <Frame />
    </Plot>
  );
}
