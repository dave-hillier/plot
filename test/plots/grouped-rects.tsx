import {Plot, RectY, groupX} from "../../src/react/index.js";

export async function groupedRects() {
  return (
    <Plot>
      <RectY data={{length: 10}} {...groupX({y: "count"}, {x: (d, i) => "ABCDEFGHIJ"[i]})} />
    </Plot>
  );
}
