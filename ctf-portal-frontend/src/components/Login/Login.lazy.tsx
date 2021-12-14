import React, { lazy, Suspense } from "react";
import Flag from "../../models/Flag";

const LazyLogin = lazy(() => import("./Login"));

interface Props extends JSX.IntrinsicAttributes {
  flag: Flag;
  flags: Flag[];
  componentDidUpdate: (arg0: { flag: Flag }) => void;
}

const Login = (props: Props & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyLogin {...props} />
  </Suspense>
);

export default Login;
