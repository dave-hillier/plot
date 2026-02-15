# Observable Plot

[<img src="https://observablehq.com/plot/plot.svg" width="320" alt="The Observable Plot logo, spelling out the letters P-L-O-T in pastel shapes.">](https://observablehq.com/plot/)

[**Observable Plot**](https://observablehq.com/plot/) is a free, [open-source](./LICENSE), JavaScript library for visualizing tabular data, focused on accelerating exploratory data analysis. It has a concise, memorable, yet expressive API, featuring [scales](https://observablehq.com/plot/features/scales) and [layered marks](https://observablehq.com/plot/features/marks) in the *grammar of graphics* style.

<a href="https://observablehq.observablehq.cloud/oss-analytics/@observablehq/plot">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://observablehq.observablehq.cloud/oss-analytics/@observablehq/plot/downloads-dark.svg">
    <img alt="Daily downloads of Observable Plot" src="https://observablehq.observablehq.cloud/oss-analytics/@observablehq/plot/downloads.svg">
  </picture>
</a>

<sub>Daily downloads of Observable Plot · [oss-analytics](https://observablehq.observablehq.cloud/oss-analytics/)</sub>

---

## React Component API

Observable Plot provides a **first-class React component API** alongside its imperative API. Use declarative JSX components to build charts natively in React applications:

```jsx
import {Plot, Dot, Line, AxisX, AxisY} from "@observablehq/plot/react";

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

### Why use the React API?

- **Native React integration** — Use Plot as composable React components (`<Plot>`, `<Dot>`, `<Line>`, etc.) that render directly into the React tree.
- **Declarative API** — Define charts with JSX, making them easier to read, compose, and maintain alongside other React code.
- **React ecosystem compatibility** — Works with React state, context, hooks, Suspense, and server-side rendering out of the box.
- **No manual DOM management** — Unlike the imperative API, there's no need for refs, effects, or manual cleanup.

### Two APIs, one core

| Imperative API | React Component API |
|---|---|
| `import * as Plot from "@observablehq/plot"` | `import {Plot, Dot} from "@observablehq/plot/react"` |
| `Plot.plot({ marks: [Plot.dot(data, {x, y})] })` | `<Plot><Dot data={data} x="x" y="y" /></Plot>` |
| Returns a detached SVG element | Renders directly into the React tree |
| Manual DOM insertion required | No refs or effects needed |

The core computation — D3 scales, shape generators, geo projections, data transforms (bin, stack, group, etc.), and channel/scale inference — is shared between both APIs. Both the imperative API and the React API coexist as separate exports from the same package.

### React examples

**Scatterplot with color encoding:**

```jsx
import {Plot, Dot} from "@observablehq/plot/react";

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
import {Plot, BarY, RuleY, binX} from "@observablehq/plot/react";

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
import {Plot, Line} from "@observablehq/plot/react";

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
import {Plot, Dot} from "@observablehq/plot/react";

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
import {Plot, AreaY, stackY} from "@observablehq/plot/react";

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
import {Plot, Dot} from "@observablehq/plot/react";

function InteractiveChart({data}) {
  return (
    <Plot>
      <Dot data={data} x="x" y="y" fill="species" tip />
    </Plot>
  );
}
```

---

## Documentation 📚

https://observablehq.com/plot/

## Examples 🖼️

https://observablehq.com/@observablehq/plot-gallery

## Releases 🚀

See our [CHANGELOG](https://github.com/observablehq/plot/blob/main/CHANGELOG.md) and summary [release notes](https://github.com/observablehq/plot/releases).

## Getting help 🏠

See our [community guide](https://observablehq.com/plot/community).

## Contributing 🙏

See [CONTRIBUTING.md](./CONTRIBUTING.md).
