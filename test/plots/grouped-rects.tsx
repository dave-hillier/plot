import {Replot, RectY, groupX} from "../../src/react/index.js";

export async function groupedRects() {
  return (
    <Replot>
      <RectY data={{length: 10}} {...groupX({y: "count"}, {x: (d, i) => "ABCDEFGHIJ"[i]})} />
    </Replot>
  );
}
