import {Plot, RectX} from "../../src/react/index.js";

export async function stackedRect() {
  return (
    <Plot
      x={{
        tickFormat: "%"
      }}
    >
      <RectX data={{length: 20}} x={(d, i) => i} fill={(d, i) => i} insetLeft={1} offset="normalize" />
    </Plot>
  );
}
