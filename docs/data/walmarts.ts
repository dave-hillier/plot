import {tsvParse, autoType} from "d3";
import raw from "../public/data/walmarts.tsv?raw";

export default tsvParse(raw).map((d) => ({...d, ...autoType(d)}));
