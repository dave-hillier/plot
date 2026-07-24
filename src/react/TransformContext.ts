import {createContext, useContext} from "react";

// Transform wrappers (<StackY>, <BinX>, …) publish a wrap function that
// enclosed marks apply to their options, plus a stamp identifying the wrapper
// configuration. Wrappers compose with their parent context — delegating
// outward so inner transforms apply first, mirroring functional nesting
// (binX(outputs, stackY(cfg, o))). wrap must only be invoked inside a mark
// factory (per computePlot run), never at component render time: transforms
// allocate lazy column() cells that computePlot fills per run.
export interface TransformContextValue {
  wrap: (options: Record<string, any>) => Record<string, any>;
  stamp: string;
}

export const TransformContext = createContext<TransformContextValue>({wrap: (options) => options, stamp: ""});

export function useTransformContext(): TransformContextValue {
  return useContext(TransformContext);
}
