import React, { lazy, Suspense } from "react";
import Flag from "../../models/Flag";

const LazyFlagList = lazy(() => import("./FlagList"));

interface Props extends JSX.IntrinsicAttributes {
  listFlagsAsync: () => void;
  initialized: boolean;
  flags: Flag[];
}

const FlagList = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyFlagList {...props} />
  </Suspense>
);

export default FlagList;
