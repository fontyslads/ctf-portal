import React, { lazy, Suspense } from 'react';

const LazySecured = lazy(() => import('./Secured'));

const Secured = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazySecured {...props} />
  </Suspense>
);

export default Secured;
