import {Replot, RectY, binX} from "../../src/react/index.js";

export async function singleValueBin() {
  return (
    <Replot>
      <RectY data={[3]} {...binX()} />
    </Replot>
  );
}
