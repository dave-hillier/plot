# Replot

**Replot** is a React component library for exploratory data visualization, based on [Observable Plot](https://observablehq.com/plot/). It provides a declarative JSX API featuring [scales](https://observablehq.com/plot/features/scales) and [layered marks](https://observablehq.com/plot/features/marks) in the *grammar of graphics* style.

---

## React Component API

Use declarative JSX components to build charts natively in React applications:

```jsx
import {Replot, Dot, Line, AxisX, AxisY} from "replot/react";

function Chart({data}) {
  return (
    <Replot width={640} height={400}>
      <Dot data={data} x="weight" y="height" stroke="species" />
      <AxisX />
      <AxisY />
    </Replot>
  );
}
```

### Why Replot?

- **Native React integration** — Use composable React components (`<Replot>`, `<Dot>`, `<Line>`, etc.) that render directly into the React tree.
- **Declarative API** — Define charts with JSX, making them easier to read, compose, and maintain alongside other React code.
- **React ecosystem compatibility** — Works with React state, context, hooks, Suspense, and server-side rendering out of the box.
- **No manual DOM management** — No need for refs, effects, or manual cleanup.
- **Built on Observable Plot** — All the power of Observable Plot's scales, transforms, and mark system.

### Design principles

Replot aims to translate Observable Plot's grammar into React idioms, not
merely rename its options:

- What Plot expresses by **wrapping** — transforms such as `binX`, `stackY`,
  `groupX` — is expressed by **nesting components**, so JSX structure
  mirrors the functional composition `binX(outputs, stackY(options))`:

  ```jsx
  <BinX y="count">
    <StackY>
      <RectY data={data} x="value" fill="sex" />
    </StackY>
  </BinX>
  ```

- What Plot expresses as **options** — channels like `x`/`y`/`fill`, styles,
  scale configuration — stays as **props**.
- Layered marks are sibling components, matching Plot's `marks: [...]` array.
- The functional transform form (`{...binX({y: "count"}, {x: "value"})}`)
  remains supported; both forms run the same transform functions and produce
  identical output.

See [PLAN.md](./PLAN.md) for the design rationale behind the transform
components.

### API overview

| Imperative API (Observable Plot) | React Component API (Replot) |
|---|---|
| `import * as Plot from "replot"` | `import {Replot, Dot} from "replot/react"` |
| `Plot.plot({ marks: [Plot.dot(data, {x, y})] })` | `<Replot><Dot data={data} x="x" y="y" /></Replot>` |
| Returns a detached SVG element | Renders directly into the React tree |
| Manual DOM insertion required | No refs or effects needed |

The core computation — D3 scales, shape generators, geo projections, data transforms (bin, stack, group, etc.), and channel/scale inference — is shared between both APIs.

### Examples

**Scatterplot with color encoding:**

```jsx
import {Replot, Dot} from "replot/react";

function Scatterplot({data}) {
  return (
    <Replot width={640} height={400} color={{scheme: "category10"}}>
      <Dot data={data} x="weight" y="height" fill="species" />
    </Replot>
  );
}
```

**Histogram with binning:**

```jsx
import {Replot, BarY, BinX, RuleY} from "replot/react";

function Histogram({data}) {
  return (
    <Replot>
      <BinX y="count">
        <BarY data={data} x="value" />
      </BinX>
      <RuleY data={[0]} />
    </Replot>
  );
}
```

**Line chart with grid and custom scales:**

```jsx
import {Replot, Line} from "replot/react";

function LineChart({data}) {
  return (
    <Replot y={{grid: true}} color={{scheme: "warm"}}>
      <Line data={data} x="date" y="temperature" stroke="city" />
    </Replot>
  );
}
```

**Faceted dot plot (small multiples):**

```jsx
import {Replot, Dot} from "replot/react";

function FacetedPlot({data}) {
  return (
    <Replot>
      <Dot data={data} x="x" y="y" fx="category" fill="group" />
    </Replot>
  );
}
```

**Stacked area chart:**

```jsx
import {Replot, AreaY, StackY} from "replot/react";

function StackedArea({data}) {
  return (
    <Replot>
      <StackY>
        <AreaY data={data} x="date" y="value" fill="category" />
      </StackY>
    </Replot>
  );
}
```

**Interactive chart with tooltips:**

```jsx
import {Replot, Dot} from "replot/react";

function InteractiveChart({data}) {
  return (
    <Replot>
      <Dot data={data} x="x" y="y" fill="species" tip />
    </Replot>
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
import {Replot, Dot, Line, BarY, AxisX, AxisY} from "replot/react";
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
