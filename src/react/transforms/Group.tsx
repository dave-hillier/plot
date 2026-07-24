import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {group, groupX, groupY, groupZ} from "../../transforms/group.js";
import type {GroupReducer} from "../../transforms/group.js";
import type {ChannelValue} from "../../channel.js";

// Output reducers and group options shared by every wrapper; the group
// transforms take a single outputs argument, so all props pass as one object.
interface GroupOutputProps {
  fill?: GroupReducer;
  stroke?: GroupReducer;
  r?: GroupReducer;
  opacity?: GroupReducer;
  fillOpacity?: GroupReducer;
  strokeOpacity?: GroupReducer;
  text?: GroupReducer;
  title?: GroupReducer;
  href?: GroupReducer;
  data?: GroupReducer;
  filter?: GroupReducer | null;
  sort?: GroupReducer | null;
  reverse?: boolean;
  // z is an input channel that subdivides groups, not an output reducer; in
  // the functional API it belongs in the mark options, so it is routed there.
  z?: ChannelValue;
  children?: ReactNode;
}

// Route the wrapper's z into the mark options (the transform's second
// argument); a z on the mark itself wins.
function mergeZ(z: ChannelValue | undefined, o: Record<string, any>): Record<string, any> {
  return z === undefined ? o : {z, ...o};
}

// Passing undefined outputs (rather than {}) lets groupX/groupY/group apply
// their no-argument defaults (e.g. groupX() implies y="count"), so a bare
// wrapper behaves exactly like the bare functional call. groupZ has no
// default, where undefined and {} are equivalent.
function orDefault(outputs: Record<string, any>): Record<string, any> | undefined {
  return Object.keys(outputs).length > 0 ? outputs : undefined;
}

export interface GroupXProps extends GroupOutputProps {
  // Output reducers (e.g. y="count") — distinct from the input channels on
  // the mark inside the wrapper.
  y?: GroupReducer;
  y1?: GroupReducer;
  y2?: GroupReducer;
}

export interface GroupYProps extends GroupOutputProps {
  x?: GroupReducer;
  x1?: GroupReducer;
  x2?: GroupReducer;
}

export interface GroupZProps extends GroupOutputProps {
  x?: GroupReducer;
  x1?: GroupReducer;
  x2?: GroupReducer;
  y?: GroupReducer;
  y1?: GroupReducer;
  y2?: GroupReducer;
}

export interface GroupProps extends GroupOutputProps {
  x?: GroupReducer;
  y?: GroupReducer;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run.
export function GroupX({children, z, ...outputs}: GroupXProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(groupX(orDefault(outputs), mergeZ(z, o))),
    stamp: parent.stamp + stampOptions("groupX", null, mergeZ(z, outputs))
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function GroupY({children, z, ...outputs}: GroupYProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(groupY(orDefault(outputs), mergeZ(z, o))),
    stamp: parent.stamp + stampOptions("groupY", null, mergeZ(z, outputs))
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function GroupZ({children, z, ...outputs}: GroupZProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(groupZ(orDefault(outputs), mergeZ(z, o))),
    stamp: parent.stamp + stampOptions("groupZ", null, mergeZ(z, outputs))
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

export function Group({children, z, ...outputs}: GroupProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(group(orDefault(outputs), mergeZ(z, o))),
    stamp: parent.stamp + stampOptions("group", null, mergeZ(z, outputs))
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
