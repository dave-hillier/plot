import {Plot, BarY, RuleX} from "../../src/react/index.js";

export async function singleValueBar() {
  return (
    <Plot>
      <BarY data={{length: 1}} x={["foo"]} y1={[0]} y2={[0]} />
      <RuleX data={["foo"]} stroke="red" y1={[0]} y2={[0]} />
    </Plot>
  );
}
