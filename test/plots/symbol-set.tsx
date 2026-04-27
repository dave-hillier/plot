import {Plot, DotX, indexOf} from "../../src/react/index.js";

export async function symbolSetFill() {
  return (
    <Plot>
      <DotX
        data={["circle", "cross", "diamond", "square", "star", "triangle", "wye"]}
        fill="currentColor"
        symbol={indexOf}
      />
    </Plot>
  );
}

export async function symbolSetStroke() {
  return (
    <Plot>
      <DotX
        data={["circle", "cross", "diamond", "square", "star", "triangle", "wye"]}
        stroke="currentColor"
        symbol={indexOf}
      />
    </Plot>
  );
}

export async function symbolSetFillColor() {
  return (
    <Plot symbol={{legend: true}}>
      <DotX
        data={["circle", "cross", "diamond", "square", "star", "triangle", "wye"]}
        fill={indexOf}
        symbol={indexOf}
      />
    </Plot>
  );
}

export async function symbolSetStrokeColor() {
  return (
    <Plot symbol={{legend: true}}>
      <DotX
        data={["circle", "cross", "diamond", "square", "star", "triangle", "wye"]}
        stroke={indexOf}
        symbol={indexOf}
      />
    </Plot>
  );
}
