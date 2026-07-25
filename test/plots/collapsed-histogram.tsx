import {Replot, RectY, binX} from "../../src/react/index.js";

export async function collapsedHistogram() {
  return (
    <Replot>
      <RectY data={[1, 1, 1]} {...binX()} />
    </Replot>
  );
}
