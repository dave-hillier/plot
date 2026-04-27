import {Plot, TickX, dodgeY} from "../../src/react/index.js";

export async function dodgeTick() {
  return (
    <Plot>
      <TickX data={[1, 2, 3]} {...dodgeY()} />
    </Plot>
  );
}
