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

## About This Fork: React Port

This fork is a **React port** of Observable Plot. The original library renders charts imperatively using D3 selections to build SVG elements. This port converts that approach into idiomatic React components with a declarative JSX API, so that Observable Plot can be used natively in React applications.

### Why port to React?

- **Native React integration** — Use Plot as composable React components (`<Plot>`, `<Dot>`, `<Line>`, etc.) instead of imperatively appending SVG nodes to the DOM.
- **Declarative API** — Define charts with JSX, making them easier to read, compose, and maintain alongside other React code.
- **React ecosystem compatibility** — Works with React state, context, hooks, Suspense, and server-side rendering out of the box.
- **Observable Framework support** — Enables integration with Observable Framework's React-based dashboard and documentation system.

### What changes?

| Original (Imperative) | This Port (React/Declarative) |
|---|---|
| `Plot.plot({ marks: [Plot.dot(data, {x, y})] })` | `<Plot><Dot data={data} x="x" y="y" /></Plot>` |
| D3 selections build the DOM | JSX renders SVG elements |
| Returns a detached SVG element | Renders directly into the React tree |
| Mutable internal state | React Context + hooks |

### What stays the same?

The core computation — D3 scales, shape generators, geo projections, data transforms (bin, stack, group, etc.), and channel/scale inference — is shared between both APIs via a common `core/` module. Both the original imperative API and the React API coexist as separate exports.

See [PLAN.md](./PLAN.md) for the full implementation plan.

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
