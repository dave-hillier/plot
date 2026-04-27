import {Plot, RectY, binX} from "../../src/react/index.js";

export async function binStrings() {
  return (
    <Plot>
      <RectY data={["9.6", "9.6", "14.8", "14.8", "7.2"]} {...binX()} />
    </Plot>
  );
}
