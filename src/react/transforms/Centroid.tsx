import React, {type ReactNode} from "react";
import {TransformContext, useTransformContext, type TransformContextValue} from "../TransformContext.js";
import {stampOptions} from "../useMark.js";
import {centroid, geoCentroid} from "../../transforms/centroid.js";
import type {ChannelValue} from "../../channel.js";

export interface CentroidProps {
  // Channel supplying GeoJSON geometry; defaults to the identity transform,
  // assuming the data is GeoJSON geometry.
  geometry?: ChannelValue;
  children?: ReactNode;
}

export interface GeoCentroidProps {
  // Channel supplying spherical GeoJSON geometry; defaults to the identity
  // transform, assuming the data is GeoJSON geometry.
  geometry?: ChannelValue;
  children?: ReactNode;
}

// Transform wrapper pattern: see Stack.tsx. Renders no visual output; the wrap
// runs inside each enclosed mark's factory, per computePlot run. centroid is a
// single-argument initializer, so the wrapper config merges into the mark
// options before the call.
export function Centroid({children, ...config}: CentroidProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(centroid({...config, ...o})),
    stamp: parent.stamp + stampOptions("centroid", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}

// As Centroid, but derives spherical centroids via geoCentroid.
export function GeoCentroid({children, ...config}: GeoCentroidProps) {
  const parent = useTransformContext();
  const value: TransformContextValue = {
    wrap: (o) => parent.wrap(geoCentroid({...config, ...o})),
    stamp: parent.stamp + stampOptions("geoCentroid", null, config)
  };
  return <TransformContext.Provider value={value}>{children}</TransformContext.Provider>;
}
