import {Replot, BarX, Frame} from "../../src/react/index.js";

export async function tickFormatEmptyDomain() {
  return (
    <Replot y={{tickFormat: "%W"}}>
      <BarX data={[]} />
      <Frame />
    </Replot>
  );
}

export async function tickFormatEmptyFacetDomain() {
  return (
    <Replot fy={{tickFormat: "%W"}}>
      <BarX data={[]} />
      <Frame />
    </Replot>
  );
}
