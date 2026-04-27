import {Plot, Line} from "../../src/react/index.js";
import {range} from "d3";

export async function groupMarker() {
  return (
    <Plot aspectRatio={1} axis={null} inset={30}>
      <Line
        data={range(20, 200)}
        x={(i) => i * Math.sin(i / 40 + ((i % 5) * 2 * Math.PI) / 5)}
        y={(i) => i * Math.cos(i / 40 + ((i % 5) * 2 * Math.PI) / 5)}
        stroke={(i) => `arrow ${i % 5}`}
        strokeWidth={(i) => Math.round(1 + i / 40)}
        marker="dot"
      />
    </Plot>
  );
}

export async function groupMarkerStart() {
  return (
    <Plot aspectRatio={1} axis={null} inset={30}>
      <Line
        data={range(500, 0, -1)}
        x={(i) => i * Math.sin(i / 100 + ((i % 5) * 2 * Math.PI) / 5)}
        y={(i) => i * Math.cos(i / 100 + ((i % 5) * 2 * Math.PI) / 5)}
        stroke={(i) => `arrow ${i % 5}`}
        strokeWidth={(i) => i / 100}
        markerStart="circle-stroke"
      />
    </Plot>
  );
}

export async function groupMarkerMid() {
  return (
    <Plot aspectRatio={1} axis={null} inset={30}>
      <Line
        data={range(20, 200)}
        x={(i) => i * Math.sin(i / 40 + ((i % 5) * 2 * Math.PI) / 5)}
        y={(i) => i * Math.cos(i / 40 + ((i % 5) * 2 * Math.PI) / 5)}
        stroke={(i) => `arrow ${i % 5}`}
        strokeWidth={(i) => Math.round(i / 40)}
        markerMid="dot"
      />
    </Plot>
  );
}

export async function groupMarkerEnd() {
  return (
    <Plot aspectRatio={1} axis={null} inset={30}>
      <Line
        data={range(500)}
        x={(i) => i * Math.sin(i / 100 + ((i % 5) * 2 * Math.PI) / 5)}
        y={(i) => i * Math.cos(i / 100 + ((i % 5) * 2 * Math.PI) / 5)}
        stroke={(i) => `arrow ${i % 5}`}
        strokeWidth={(i) => i / 100}
        markerEnd="arrow"
      />
    </Plot>
  );
}
