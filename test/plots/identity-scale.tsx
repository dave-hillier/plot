import {Plot, Dot} from "../../src/react/index.js";
import * as d3 from "d3";

export async function identityScale() {
  const random = d3.randomLcg(42);
  return (
    <Plot x={{type: "identity"}} y={{type: "identity"}} color={{type: "identity"}}>
      <Dot
        data={{length: 100}}
        x={() => 600 * random()}
        y={() => 100 + 500 * random()}
        fill={() => "red"}
        stroke={() => "blue"}
      />
    </Plot>
  );
}
