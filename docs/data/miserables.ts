import raw from "../public/data/miserables.json?raw";

const data = JSON.parse(raw);

export default Object.assign(data, {groups: new Map(data.nodes.map((d) => [d.id, d.group]))});
