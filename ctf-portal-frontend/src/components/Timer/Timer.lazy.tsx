import React, { lazy, Suspense } from "react";
import Flag from "../../models/Flag";

const LazyTimer = lazy(() => import("./Timer"));

const Timer = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyTimer {...props} />
  </Suspense>
);

export default Timer;
