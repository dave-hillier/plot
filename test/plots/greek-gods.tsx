import {Plot, TreeMark, Link, Dot, Text, treeLink, treeNode} from "../../src/react/index.js";

export async function greekGodsDefaults() {
  const gods = `Chaos Gaia Mountains
Chaos Gaia Pontus
Chaos Gaia Uranus
Chaos Eros
Chaos Erebus
Chaos Tartarus`
    .split("\n")
    .map((d) => d.replace(/\s+/g, "/"));
  return (
    <Plot axis={null} insetLeft={35} insetTop={20} insetBottom={20} insetRight={120}>
      <Link data={gods} {...treeLink()} />
      <Dot data={gods} {...treeNode()} />
      <Text data={gods} {...treeNode()} />
    </Plot>
  );
}

export async function greekGods() {
  const gods = `Chaos Gaia Mountains
Chaos Gaia Pontus
Chaos Gaia Uranus
Chaos Eros
Chaos Erebus
Chaos Tartarus`
    .split("\n")
    .map((d) => d.replace(/\s+/g, "/"));
  return (
    <Plot axis={null} insetLeft={35} insetTop={20} insetBottom={20} insetRight={120}>
      <TreeMark data={gods} />
    </Plot>
  );
}

export async function greekGodsTip() {
  const gods = `Chaos Gaia Mountains
Chaos Gaia Pontus
Chaos Gaia Uranus
Chaos Eros
Chaos Erebus
Chaos Tartarus`
    .split("\n")
    .map((d) => d.replace(/\s+/g, "/"));
  return (
    <Plot axis={null} insetLeft={35} insetTop={20} insetBottom={20} insetRight={120}>
      <TreeMark data={gods} tip={true} />
    </Plot>
  );
}

export async function greekGodsExplicit() {
  const gods = `Chaos Gaia Mountains
Chaos Gaia Pontus
Chaos Gaia Uranus
Chaos Eros
Chaos Erebus
Chaos Tartarus`.split("\n");
  return (
    <Plot axis={null} insetLeft={10} insetTop={20} insetBottom={20} insetRight={120}>
      <Link data={gods} {...treeLink({stroke: "node:internal", delimiter: " "})} />
      <Dot data={gods} {...treeNode({fill: "node:internal", delimiter: " "})} />
      <Text
        data={gods}
        {...treeNode({text: "node:name", stroke: "white", fill: "currentColor", dx: 6, delimiter: " "})}
      />
    </Plot>
  );
}
