import React, { lazy, Suspense } from "react";
import Flag from "../../../models/Flag";

const LazyCrossover = lazy(() => import("./Crossover"));

interface Props extends JSX.IntrinsicAttributes {
  flags: Flag[];
}

const Crossover = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyCrossover {...props} />
  </Suspense>
);

export default Crossover;
