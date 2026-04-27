import {Plot, RuleX, dodgeY} from "../../src/react/index.js";

export async function dodgeRule() {
  return (
    <Plot>
      <RuleX data={[1, 2, 3]} {...dodgeY()} />
    </Plot>
  );
}
