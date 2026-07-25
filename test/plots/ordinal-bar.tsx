import {Replot, BarY, RuleY} from "../../src/react/index.js";

export async function ordinalBar() {
  return (
    <Replot
      y={{
        grid: true
      }}
    >
      <BarY data="ABCDEF" />
      <RuleY data={[0]} />
    </Replot>
  );
}
