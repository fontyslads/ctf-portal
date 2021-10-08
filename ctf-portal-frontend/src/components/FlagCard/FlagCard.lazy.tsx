import React, { lazy, Suspense } from 'react';

const LazyFlagCard = lazy(() => import('./FlagCard'));

const FlagCard = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyFlagCard {...props} />
  </Suspense>
);

export default FlagCard;
