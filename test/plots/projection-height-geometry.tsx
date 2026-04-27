import {Plot, Geo, Frame, Graticule, Sphere} from "../../src/react/index.js";

const shape = {
  type: "LineString",
  coordinates: Array.from({length: 201}, (_, i) => {
    const angle = (i / 100) * Math.PI;
    const r = (i % 2) + 5;
    return [300 + 30 * r * Math.cos(angle), 185 + 30 * r * Math.sin(angle)];
  })
} as const;

export async function projectionHeightGeometry() {
  return (
    <Plot facet={{data: [0, 1], y: [0, 1]}} projection="identity">
      <Geo data={shape} />
      <Frame stroke="red" strokeDasharray={4} />
    </Plot>
  );
}

export async function projectionHeightDegenerate() {
  return (
    <Plot style="border: #777 1px solid;" projection="mercator" height={400} inset={199.5}>
      <Graticule />
      <Sphere />
    </Plot>
  );
}

export async function projectionHeightGeometryDomain() {
  return (
    <Plot projection={{type: "identity", domain: shape}}>
      <Geo data={shape} />
      <Frame stroke="red" strokeDasharray={4} />
    </Plot>
  );
}

export async function projectionHeightGeometryNull() {
  return (
    <Plot aspectRatio={true} width={400} facet={{data: [0, 1], y: [0, 1]}}>
      <Geo data={shape} />
      <Frame stroke="red" strokeDasharray={4} />
    </Plot>
  );
}
