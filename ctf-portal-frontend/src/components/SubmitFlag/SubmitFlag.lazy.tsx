import React, { lazy, Suspense } from "react";

const LazySubmitFlag = lazy(() => import("./SubmitFlag"));

const SubmitFlag = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazySubmitFlag {...props} />
  </Suspense>
);

export default SubmitFlag;
