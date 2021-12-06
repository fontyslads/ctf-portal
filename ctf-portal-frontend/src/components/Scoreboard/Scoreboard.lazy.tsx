import React, { lazy, Suspense } from "react";
import Flag from "../../models/Flag";

const LazyScoreboard = lazy(() => import("./Scoreboard"));

interface Props extends JSX.IntrinsicAttributes {
  flag: Flag;
  flags: Flag[];
  componentDidUpdate: (arg0: { flag: Flag }) => void;
}

const Scoreboard = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyScoreboard {...props} />
  </Suspense>
);

export default Scoreboard;
