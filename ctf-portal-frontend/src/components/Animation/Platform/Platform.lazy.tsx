import React, { lazy, Suspense } from "react";
import Flag from "../../../models/Flag";

const LazyPlatform = lazy(() => import("./Platform"));

interface Props extends JSX.IntrinsicAttributes {
  flags: Flag[];
}

const Platform = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyPlatform {...props} />
  </Suspense>
);

export default Platform;
