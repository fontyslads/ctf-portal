import React, { lazy, Suspense } from "react";

const LazyFlagList = lazy(() => import("./FlagList"));

const FlagList = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyFlagList {...props} />
  </Suspense>
);

export default FlagList;
