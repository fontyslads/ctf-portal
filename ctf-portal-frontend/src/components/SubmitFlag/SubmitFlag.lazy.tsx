import React, { lazy, Suspense } from "react";
import Flag from "../../models/Flag";

const LazySubmitFlag = lazy(() => import("./SubmitFlag"));

interface Props extends JSX.IntrinsicAttributes {
  flag: Flag;
}

const SubmitFlag = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazySubmitFlag {...props} />
  </Suspense>
);

export default SubmitFlag;
