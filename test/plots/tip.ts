import React from "react";
import {Plot, AreaY, Dot, DotX, LineX, LineY, RectY, RuleX, Tip, Frame, Geo, Raster, Cell, BarX, BarY, Hexagon, Voronoi, VoronoiMesh, binX, groupY, groupX, group, dodgeY, hexbin, centroid, geoCentroid, pointer, identity} from "../../src/react/index.js";
import * as d3 from "d3";
import {feature, mesh} from "topojson-client";

export async function tipAreaBand() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(AreaY, {data: aapl, x: "Date", y1: "Low", y2: "High", tip: true, curve: "step", stroke: "currentColor"})
  );
}

export async function tipAreaStack() {
  const industries = await d3.csv<any>("data/bls-industry-unemployment.csv", d3.autoType);
  return React.createElement(Plot, {marginLeft: 50},
    React.createElement(AreaY, {data: industries, x: "date", y: "unemployed", fill: "industry", tip: true})
  );
}

export async function tipBar() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {marginLeft: 100},
    React.createElement(BarX, {data: olympians, ...groupY({x: "count"}, {y: "sport", sort: {y: "x"}, tip: true})})
  );
}

export async function tipBin() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: olympians, ...binX({y: "count"}, {x: "weight", tip: true})})
  );
}

export async function tipBinStack() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(RectY, {data: olympians, ...binX({y: "count", sort: "z"}, {x: "weight", fill: "sex", tip: true})})
  );
}

export async function tipCell() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 400,
      marginLeft: 100,
      color: {scheme: "blues"}
    },
    React.createElement(Cell, {data: olympians, ...group({fill: "count"}, {x: "sex", y: "sport", tip: "y"})})
  );
}

export async function tipCellFacet() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      height: 400,
      marginLeft: 100,
      color: {scheme: "blues"}
    },
    React.createElement(Cell, {data: olympians, ...groupY({fill: "count"}, {fx: "sex", y: "sport", tip: "y"})})
  );
}

export async function tipDodge() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {height: 160},
    React.createElement(Dot, {data: penguins, ...dodgeY({x: "culmen_length_mm", r: "body_mass_g", tip: true})})
  );
}

export async function tipDot() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: penguins, x: "culmen_length_mm", y: "culmen_depth_mm", stroke: "sex", tip: true})
  );
}

export async function tipDotX() {
  return React.createElement(Plot, {},
    React.createElement(DotX, {data: d3.range(10), tip: true})
  );
}

export async function tipDotFacets() {
  const athletes = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {
      grid: true,
      fy: {
        label: "decade of birth",
        interval: "10 years"
      }
    },
    React.createElement(Dot, {
      data: athletes,
      x: "weight",
      y: "height",
      fx: "sex",
      fy: "date_of_birth",
      stroke: "#aaa",
      filter: (d) => !d.info
    }),
    React.createElement(Dot, {
      data: athletes,
      x: "weight",
      y: "height",
      fx: "sex",
      fy: "date_of_birth",
      filter: (d) => d.info,
      title: (d) => [d.name, d.info].join("\n"),
      tip: true
    })
  );
}

export async function tipDotFilter() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  const xy = {x: "culmen_length_mm", y: "culmen_depth_mm", stroke: "sex"};
  return React.createElement(Plot, {},
    React.createElement(Dot, {data: penguins, ...xy, filter: (d) => d.sex === "MALE", tip: true}),
    React.createElement(Dot, {data: penguins, ...xy, filter: (d) => d.sex === "FEMALE", tip: true})
  );
}

export async function tipGeoNoProjection() {
  const counties = await d3.json<any>("data/us-counties-10m.json").then((us) => feature(us, us.objects.counties));
  counties.features = counties.features.filter((d) => {
    const [x, y] = d3.geoCentroid(d);
    return x > -126 && x < -68 && y > 25 && y < 49;
  });
  return React.createElement(Plot, {},
    React.createElement(Geo, {data: counties, ...centroid({title: (d) => d.properties.name, tip: true})})
  );
}

export async function tipGeoProjection() {
  const counties = await d3.json<any>("data/us-counties-10m.json").then((us) => feature(us, us.objects.counties));
  counties.features = counties.features.filter((d) => {
    const [x, y] = d3.geoCentroid(d);
    return x > -126 && x < -68 && y > 25 && y < 49;
  });
  return React.createElement(Plot, {projection: "albers"},
    React.createElement(Geo, {data: counties, ...centroid({title: (d) => d.properties.name, tip: true})})
  );
}

export async function tipGeoCentroid() {
  const [[counties, countymesh]] = await Promise.all([
    d3
      .json<any>("data/us-counties-10m.json")
      .then((us) => [feature(us, us.objects.counties), mesh(us, us.objects.counties)])
  ]);
  // Alternatively, using centroid (slower):
  // const pntr = pointer(centroid());
  const {x, y} = geoCentroid();
  const pntr = pointer({px: x, py: y, x, y});
  return React.createElement(Plot, {
      width: 960,
      height: 600,
      projection: "albers-usa"
    },
    React.createElement(Geo, {data: countymesh}),
    React.createElement(Geo, {data: counties, ...pntr, stroke: "red", strokeWidth: 2}),
    React.createElement(Tip, {data: counties.features, ...pntr, channels: {name: (d) => d.properties.name}})
  );
}

export async function tipGroupPrimitives() {
  return React.createElement(Plot, {
      height: 80,
      x: {type: "band"}
    },
    React.createElement(BarY, {data: "de156a2fc8", ...groupX({y: "count"}, {x: (d) => d, tip: true})})
  );
}

export async function tipHexbin() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Hexagon, {data: olympians, ...hexbin({r: "count"}, {x: "weight", y: "height", tip: true})})
  );
}

// Normally you would slap a tip: true on the hexagon, as above, but here we
// want to test that the hexbin transform isn't applying an erroneous stroke:
// none to the tip options (which would change the tip appearance).
export async function tipHexbinExplicit() {
  const olympians = await d3.csv<any>("data/athletes.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(Hexagon, {data: olympians, ...hexbin({fill: "count"}, {x: "weight", y: "height"})}),
    React.createElement(Tip, {data: olympians, ...pointer(hexbin({fill: "count"}, {x: "weight", y: "height"}))})
  );
}

export async function tipLineX() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(LineX, {data: aapl, y: "Date", x: "Close", tip: true})
  );
}

export async function tipLineY() {
  const aapl = await d3.csv<any>("data/aapl.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(LineY, {data: aapl, x: "Date", y: "Close", tip: true})
  );
}

export async function tipLongText() {
  return React.createElement(Plot, {},
    React.createElement(Tip, {data: [{x: "Long sentence that gets cropped after a certain length"}], x: "x"})
  );
}

export async function tipNewLines() {
  return React.createElement(Plot, {
      height: 40,
      style: "overflow: visible;",
      x: {axis: "top", label: null}
    },
    React.createElement(Tip, {
      data: [
        {x: "after", label: `Hello\n\n`},
        {x: "before", label: `\n\nWorld`},
        {x: "between", label: `{\n\n}`}
      ],
      x: "x",
      anchor: "top",
      title: "label"
    }),
    React.createElement(Tip, {
      data: [{x: "no name"}],
      x: "x",
      channels: {a: ["first"], b: ["second"], "": [""]}
    })
  );
}

export async function tipRaster() {
  const ca55 = await d3.csv<any>("data/ca55-south.csv", d3.autoType);
  const domain = {type: "MultiPoint", coordinates: ca55.map((d) => [d.GRID_EAST, d.GRID_NORTH])} as const;
  return React.createElement(Plot, {
      width: 640,
      height: 484,
      projection: {type: "reflect-y", inset: 3, domain},
      color: {type: "diverging"}
    },
    React.createElement(Raster, {data: ca55, x: "GRID_EAST", y: "GRID_NORTH", fill: "MAG_IGRF90", interpolate: "nearest", tip: true})
  );
}

export async function tipRule() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {},
    React.createElement(RuleX, {data: penguins, x: "body_mass_g", tip: true})
  );
}

export async function tipRuleAnchored() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {x: {insetLeft: 110}},
    React.createElement(RuleX, {data: penguins, x: "body_mass_g"}),
    React.createElement(Tip, {data: penguins, ...pointer({px: "body_mass_g", frameAnchor: "left", anchor: "middle", dx: 42})})
  );
}

export async function tipTransform() {
  return React.createElement(Plot, {
      width: 245,
      color: {percent: true, legend: true}
    },
    React.createElement(DotX, {data: [0, 0.1, 0.3, 1], fill: identity, r: 10, frameAnchor: "middle", tip: true})
  );
}

export async function tipFacetX() {
  const data = d3.range(100).map((i) => ({f: i > 60 || i % 2 ? "b" : "a", x: i, y: i / 10}));
  return React.createElement(Plot, {
      inset: 10,
      y: {domain: [0, 7]}
    },
    React.createElement(Frame, {}),
    React.createElement(Dot, {data, fy: "f", x: "x", y: "y", tip: "x", fill: "f"}),
    React.createElement(Dot, {
      data: [
        {f: "a", y: 3},
        {f: "b", y: 1}
      ],
      fy: "f",
      x: 90,
      y: "y",
      r: 30,
      fill: "f",
      fillOpacity: 0.1,
      stroke: "currentColor",
      strokeDasharray: 4
    })
  );
}

export async function tipColorLiteral() {
  const penguins = await d3.csv<any>("data/penguins.csv", d3.autoType);
  return React.createElement(Plot, {grid: true},
    React.createElement(Dot, {
      data: penguins,
      x: "culmen_length_mm",
      y: "culmen_depth_mm",
      fill: (d) => (d.species === "Adelie" ? "orange" : "steelblue"),
      tip: true
    })
  );
}
