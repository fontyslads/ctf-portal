import React, { lazy, Suspense } from "react";
import Flag from "../../../models/Flag";

const LazyCommTower = lazy(() => import("./CommTower"));

interface Props extends JSX.IntrinsicAttributes {
  flags: Flag[];
}

const CommTower = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyCommTower {...props} />
  </Suspense>
);

export default CommTower;
