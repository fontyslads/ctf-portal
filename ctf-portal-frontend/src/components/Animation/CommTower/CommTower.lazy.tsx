import React, { lazy, Suspense } from "react";

const LazyCommTower = lazy(() => import("./CommTower"));

const CommTower = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyCommTower {...props} />
  </Suspense>
);

export default CommTower;
