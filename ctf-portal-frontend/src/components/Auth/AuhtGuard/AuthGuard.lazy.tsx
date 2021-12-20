import React, { lazy, Suspense } from "react";

const LazyAuhtGuard = lazy(() => import("./AuhtGuard"));

const AuthGuard = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyAuhtGuard {...props} />
  </Suspense>
);

export default AuthGuard;