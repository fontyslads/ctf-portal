import React, { lazy, Suspense } from "react";
import Flag from "../../../models/Flag";

const LazyTrainCrash = lazy(() => import("./TrainCrash"));

interface Props extends JSX.IntrinsicAttributes {
  flags: Flag[];
}

const TrainCrash = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyTrainCrash {...props} />
  </Suspense>
);

export default TrainCrash;
