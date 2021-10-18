import React, { lazy, Suspense } from "react";
import Flag from "../../models/Flag";

const LazyFlagCard = lazy(() => import("./FlagCard"));

interface Props extends JSX.IntrinsicAttributes {
  flag: Flag;
  flags: Flag[];
  componentDidUpdate: (arg0: { flag: Flag }) => void;
}

const FlagCard = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyFlagCard {...props} />
  </Suspense>
);

export default FlagCard;
