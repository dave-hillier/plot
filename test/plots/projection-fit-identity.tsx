import {Plot, Geo} from "../../src/react/index.js";

export async function projectionFitIdentity() {
  return (
    <Plot
      width={640}
      height={400}
      projection={{
        type: "identity",
        domain: {
          type: "MultiPoint",
          coordinates: [
            [-32, -20],
            [32, 20]
          ]
        }
      }}
    >
      <Geo
        data={{
          type: "LineString",
          coordinates: Array.from({length: 400}, (_, i) => [Math.cos(i / 10) * (i / 20), Math.sin(i / 10) * (i / 20)])
        }}
      />
    </Plot>
  );
}
