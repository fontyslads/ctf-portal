import React, { lazy, Suspense } from "react";

const LazyPlatform = lazy(() => import("./Platform"));

const Platform = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyPlatform {...props} />
  </Suspense>
);

export default Platform;
