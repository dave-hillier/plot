import {Plot, RectY, binX} from "../../src/react/index.js";

export async function singleValueBin() {
  return (
    <Plot>
      <RectY data={[3]} {...binX()} />
    </Plot>
  );
}
