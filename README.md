# Replot

**Replot** is a React component library for exploratory data visualization, based on [Observable Plot](https://observablehq.com/plot/). It provides a declarative JSX API featuring [scales](https://observablehq.com/plot/features/scales) and [layered marks](https://observablehq.com/plot/features/marks) in the *grammar of graphics* style.

---

## React Component API

Use declarative JSX components to build charts natively in React applications:

```jsx
import {Plot, Dot, Line, AxisX, AxisY} from "replot/react";

function Chart({data}) {
  return (
    <Plot width={640} height={400}>
      <Dot data={data} x="weight" y="height" stroke="species" />
      <AxisX />
      <AxisY />
    </Plot>
  );
}
```

### Why Replot?

- **Native React integration** — Use composable React components (`<Plot>`, `<Dot>`, `<Line>`, etc.) that render directly into the React tree.
- **Declarative API** — Define charts with JSX, making them easier to read, compose, and maintain alongside other React code.
- **React ecosystem compatibility** — Works with React state, context, hooks, Suspense, and server-side rendering out of the box.
- **No manual DOM management** — No need for refs, effects, or manual cleanup.
- **Built on Observable Plot** — All the power of Observable Plot's scales, transforms, and mark system.

### API overview

| Imperative API (Observable Plot) | React Component API (Replot) |
|---|---|
| `import * as Plot from "replot"` | `import {Plot, Dot} from "replot/react"` |
| `Plot.plot({ marks: [Plot.dot(data, {x, y})] })` | `<Plot><Dot data={data} x="x" y="y" /></Plot>` |
| Returns a detached SVG element | Renders directly into the React tree |
| Manual DOM insertion required | No refs or effects needed |

The core computation — D3 scales, shape generators, geo projections, data transforms (bin, stack, group, etc.), and channel/scale inference — is shared between both APIs.

### Examples

**Scatterplot with color encoding:**

```jsx
import {Plot, Dot} from "replot/react";

function Scatterplot({data}) {
  return (
    <Plot width={640} height={400} color={{scheme: "category10"}}>
      <Dot data={data} x="weight" y="height" fill="species" />
    </Plot>
  );
}
```

**Histogram with binning:**

```jsx
import {Plot, BarY, RuleY, binX} from "replot/react";

function Histogram({data}) {
  return (
    <Plot>
      <BarY data={data} {...binX({y: "count"}, {x: "value"})} />
      <RuleY data={[0]} />
    </Plot>
  );
}
```

**Line chart with grid and custom scales:**

```jsx
import {Plot, Line} from "replot/react";

function LineChart({data}) {
  return (
    <Plot y={{grid: true}} color={{scheme: "warm"}}>
      <Line data={data} x="date" y="temperature" stroke="city" />
    </Plot>
  );
}
```

**Faceted dot plot (small multiples):**

```jsx
import {Plot, Dot} from "replot/react";

function FacetedPlot({data}) {
  return (
    <Plot>
      <Dot data={data} x="x" y="y" fx="category" fill="group" />
    </Plot>
  );
}
```

**Stacked area chart:**

```jsx
import {Plot, AreaY, stackY} from "replot/react";

function StackedArea({data}) {
  return (
    <Plot>
      <AreaY data={data} x="date" y="value" fill="category" {...stackY()} />
    </Plot>
  );
}
```

**Interactive chart with tooltips:**

```jsx
import {Plot, Dot} from "replot/react";

function InteractiveChart({data}) {
  return (
    <Plot>
      <Dot data={data} x="x" y="y" fill="species" tip />
    </Plot>
  );
}
```

---

## Getting started

```bash
npm install replot
```

Then import the React API:

```js
import {Plot, Dot, Line, BarY, AxisX, AxisY} from "replot/react";
```

Or the imperative API:

```js
import * as Plot from "replot";
```

## Based on Observable Plot

Replot is a fork of [Observable Plot](https://observablehq.com/plot/), ported to provide a first-class React component API. See the [Observable Plot documentation](https://observablehq.com/plot/) for full details on scales, marks, transforms, and projections.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[ISC](./LICENSE)
