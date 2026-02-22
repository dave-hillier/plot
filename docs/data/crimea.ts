import {csvParse, autoType} from "d3";
import raw from "../public/data/crimean-war.csv?raw";

const crimea = csvParse(raw);

export default crimea.columns
  .slice(2)
  .flatMap((cause) => crimea.map(({date, [cause]: deaths}) => autoType({date, cause, deaths})));
