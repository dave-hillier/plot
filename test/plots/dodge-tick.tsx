import {Replot, TickX, dodgeY} from "../../src/react/index.js";

export async function dodgeTick() {
  return (
    <Replot>
      <TickX data={[1, 2, 3]} {...dodgeY()} />
    </Replot>
  );
}
