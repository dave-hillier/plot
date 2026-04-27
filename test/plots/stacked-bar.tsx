import {Plot, BarX, stackX} from "../../src/react/index.js";

export async function stackedBar() {
  return (
    <Plot
      x={{
        tickFormat: "%"
      }}
    >
      <BarX
        data={{length: 20}}
        {...stackX({
          x: (d, i) => i,
          fill: (d, i) => i,
          insetLeft: 1,
          offset: "normalize"
        })}
      />
    </Plot>
  );
}
