import React, { lazy, Suspense } from 'react';

const LazyWelcome = lazy(() => import('./Welcome'));

const Welcome = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyWelcome {...props} />
  </Suspense>
);

export default Welcome;
