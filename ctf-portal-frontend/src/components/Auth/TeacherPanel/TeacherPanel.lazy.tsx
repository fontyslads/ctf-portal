import React, { lazy, Suspense } from "react";

const LazyTeacherPanel = lazy(() => import("./TeacherPanel"));

const TeacherPanel = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyTeacherPanel {...props} />
  </Suspense>
);

export default TeacherPanel;
