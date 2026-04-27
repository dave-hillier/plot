import {Plot, LineY} from "../../src/react/index.js";

export async function zeroNegativeY() {
  return (
    <Plot y={{zero: true}}>
      <LineY data={[-0.25, -0.15, -0.05]} />
    </Plot>
  );
}

export async function zeroPositiveY() {
  return (
    <Plot y={{zero: true}}>
      <LineY data={[0.25, 0.15, 0.05]} />
    </Plot>
  );
}

export async function zeroPositiveDegenerateY() {
  return (
    <Plot y={{zero: true}}>
      <LineY data={[0.25, 0.25, 0.25]} />
    </Plot>
  );
}

export async function zeroNegativeDegenerateY() {
  return (
    <Plot y={{zero: true}}>
      <LineY data={[-0.25, -0.25, -0.25]} />
    </Plot>
  );
}
