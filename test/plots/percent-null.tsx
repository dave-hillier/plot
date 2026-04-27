import {Plot, Dot} from "../../src/react/index.js";

export async function percentNull() {
  const time = [1, 2, 3, 4, 5];
  const value = [null, null, 1, null, null];
  return (
    <Plot y={{percent: true}}>
      <Dot data={time} x={time} y={value} />
    </Plot>
  );
}
