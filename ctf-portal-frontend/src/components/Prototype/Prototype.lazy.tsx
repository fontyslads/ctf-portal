import React, { lazy, Suspense } from 'react';

const LazyPrototype = lazy(() => import('./Prototype'));

const Prototype = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPrototype {...props} />
  </Suspense>
);

export default Prototype;
