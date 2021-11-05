import React, { lazy, Suspense } from "react";

const LazyCrossover = lazy(() => import("./Crossover"));

const Crossover = (
  props: JSX.IntrinsicAttributes & { children?: React.ReactNode }
) => (
  <Suspense fallback={null}>
    <LazyCrossover {...props} />
  </Suspense>
);

export default Crossover;
