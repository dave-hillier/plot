import {Plot, BarY, RuleY} from "../../src/react/index.js";

export async function ordinalBar() {
  return (
    <Plot
      y={{
        grid: true
      }}
    >
      <BarY data="ABCDEF" />
      <RuleY data={[0]} />
    </Plot>
  );
}
