export interface SidebarItem {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
}

export const sidebar: SidebarItem[] = [
  {
    text: "Introduction",
    items: [
      {text: "What is Plot?", link: "/what-is-plot"},
      {text: "Why Plot?", link: "/why-plot"},
      {text: "Getting started", link: "/getting-started"}
    ]
  },
  {
    text: "Features",
    collapsed: false,
    items: [
      {text: "Plots", link: "/features/plots"},
      {text: "Marks", link: "/features/marks"},
      {text: "Scales", link: "/features/scales"},
      {text: "Projections", link: "/features/projections"},
      {text: "Transforms", link: "/features/transforms"},
      {text: "Interactions", link: "/features/interactions"},
      {text: "Facets", link: "/features/facets"},
      {text: "Legends", link: "/features/legends"},
      {text: "Curves", link: "/features/curves"},
      {text: "Formats", link: "/features/formats"},
      {text: "Intervals", link: "/features/intervals"},
      {text: "Markers", link: "/features/markers"},
      {text: "Shorthand", link: "/features/shorthand"},
      {text: "Accessibility", link: "/features/accessibility"}
    ]
  },
  {
    text: "Marks",
    collapsed: true,
    items: [
      {text: "Area", link: "/marks/area"},
      {text: "Arrow", link: "/marks/arrow"},
      {text: "Auto", link: "/marks/auto"},
      {text: "Axis", link: "/marks/axis"},
      {text: "Bar", link: "/marks/bar"},
      {text: "Bollinger", link: "/marks/bollinger"},
      {text: "Box", link: "/marks/box"},
      {text: "Cell", link: "/marks/cell"},
      {text: "Contour", link: "/marks/contour"},
      {text: "Delaunay", link: "/marks/delaunay"},
      {text: "Density", link: "/marks/density"},
      {text: "Difference", link: "/marks/difference"},
      {text: "Dot", link: "/marks/dot"},
      {text: "Frame", link: "/marks/frame"},
      {text: "Geo", link: "/marks/geo"},
      {text: "Grid", link: "/marks/grid"},
      {text: "Hexgrid", link: "/marks/hexgrid"},
      {text: "Image", link: "/marks/image"},
      {text: "Line", link: "/marks/line"},
      {text: "Linear regression", link: "/marks/linear-regression"},
      {text: "Link", link: "/marks/link"},
      {text: "Raster", link: "/marks/raster"},
      {text: "Rect", link: "/marks/rect"},
      {text: "Rule", link: "/marks/rule"},
      {text: "Text", link: "/marks/text"},
      {text: "Tick", link: "/marks/tick"},
      {text: "Tip", link: "/marks/tip"},
      {text: "Tree", link: "/marks/tree"},
      {text: "Vector", link: "/marks/vector"},
      {text: "Waffle", link: "/marks/waffle"}
    ]
  },
  {
    text: "Transforms",
    collapsed: true,
    items: [
      {text: "Bin", link: "/transforms/bin"},
      {text: "Centroid", link: "/transforms/centroid"},
      {text: "Dodge", link: "/transforms/dodge"},
      {text: "Filter", link: "/transforms/filter"},
      {text: "Group", link: "/transforms/group"},
      {text: "Hexbin", link: "/transforms/hexbin"},
      {text: "Interval", link: "/transforms/interval"},
      {text: "Map", link: "/transforms/map"},
      {text: "Normalize", link: "/transforms/normalize"},
      {text: "Select", link: "/transforms/select"},
      {text: "Shift", link: "/transforms/shift"},
      {text: "Sort", link: "/transforms/sort"},
      {text: "Stack", link: "/transforms/stack"},
      {text: "Tree", link: "/transforms/tree"},
      {text: "Window", link: "/transforms/window"}
    ]
  },
  {
    text: "Interactions",
    collapsed: true,
    items: [
      {text: "Crosshair", link: "/interactions/crosshair"},
      {text: "Pointer", link: "/interactions/pointer"}
    ]
  },
  {text: "API index", link: "/api"}
];
