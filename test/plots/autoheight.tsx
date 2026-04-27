import {Plot, RectY} from "../../src/react/index.js";

export async function autoHeightEmpty() {
  return (
    <Plot>
      <RectY data={[]} x="date" y="visitors" fy="path" />
    </Plot>
  );
}
