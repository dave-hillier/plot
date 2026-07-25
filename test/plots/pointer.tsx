import {Plot, Dot, LineY, RuleX, pointer, pointerX} from "../../src/react/index.js";
import * as d3 from "d3";

export async function pointerRenderCompose() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return (
    <Plot>
      <Dot
        data={penguins}
        {...pointer({
          x: "culmen_length_mm",
          y: "culmen_depth_mm",
          r: 8,
          fill: "red",
          render(index, scales, values, dimensions, context, next) {
            const node = next(index, scales, values, dimensions, context);
            node.setAttribute("fill", "blue");
            return node;
          }
        })}
      />
      <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" />
    </Plot>
  );
}

export async function pointerViewof() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  const plot = (
    <Plot>
      <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" tip />
    </Plot>
  );
  // TODO: viewof interaction with textarea requires imperative DOM manipulation
  return plot;
}

export async function pointerViewofTitle() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  const plot = (
    <Plot title="Penguins">
      <Dot data={penguins} x="culmen_length_mm" y="culmen_depth_mm" tip />
    </Plot>
  );
  // TODO: viewof interaction with textarea requires imperative DOM manipulation
  return plot;
}

export async function pointerNonFaceted() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return (
    <Plot>
      <LineY data={aapl} x="Date" y="Close" fy={(d) => d.Close % 2 === 0} />
      <RuleX data={aapl} x="Date" strokeOpacity={0.1} />
      <RuleX data={aapl} {...pointerX({x: "Date", stroke: "red"})} />
    </Plot>
  );
}
