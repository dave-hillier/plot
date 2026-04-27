import {Plot, RectY, binX} from "../../src/react/index.js";

export async function collapsedHistogram() {
  return (
    <Plot>
      <RectY data={[1, 1, 1]} {...binX()} />
    </Plot>
  );
}
